import { TransframeConsumerInterface } from "./interfaces/types";
import { createRpcCallbackPlaceholder, createRpcConnectRequest, createRpcRequest, isRPCCallbackCall, isRPCConnectResponse, isRPCMessage, isRPCResponse } from "./rpc/util";
import { ContextFromSourceApi, TransframeConsumerApi, TransframeConsumerOptions, TransframeSourceApi } from "./types";
import { generateId } from "./util";

const DEFAULT_API_CALL_TIMEOUT = 5000;
const CONNECT_RETRY_INTERVAL = 5;
const CONNECT_RETRY_COUNT = 5;

// a tuple of resolve and reject functions
type ResolveReject = [Function, Function];
export class TransframeConsumer<SourceApi extends TransframeSourceApi<ContextFromSourceApi<SourceApi>>> {

  private _options?: TransframeConsumerOptions<SourceApi>;
  private _api: TransframeConsumerApi<SourceApi>;

  // map of request ids to callbacks; used to resolve/reject promises
  private _requestCallbacks: Map<string, ResolveReject> = new Map();

  // if the user passes a callback in an api call, it'll be stored here
  // since we can't actually pass a function over the wire. The parent
  // will have to "call" our callback by sending us messages using the `rpc-callback` type
  private _rpcCallbacks: Map<string, Function> = new Map();

  private _availableMethods: Set<string> = new Set();
  private _isConnected: boolean = false;
  private _isConnecting: boolean = false;

  // if we're not connected, we'll queue up api calls and send them when we connect
  private _apiCallQueue: Array<Function> = [];

  constructor (
    private _interface: TransframeConsumerInterface,
    options?: TransframeConsumerOptions<SourceApi>
  ) {
    this._options = options;
    this._api = this._buildApi();

    // set up the message handler
    this._interface.onMessage(this._messageHandler);

    // connect immediately if the option is set
    if (this._options?.connectImmediately !== false) {
      this.connect();
    }
  }

  private _buildApi = () => {
    // create a proxy that will call the `call` method
    const api = new Proxy(
      {} as TransframeConsumerApi<SourceApi>,
      {
        get: (_target, prop: string) => {
          // whatever the property is, return a function that calls the `call` method
          return (...payload: Parameters<TransframeConsumerApi<SourceApi>[typeof prop]>) => this.call(prop, ...payload);
        }
      }
    );

    return api;
  }

  // go through the api call queue and send all the calls
  private _processApiCallQueue() {
    this._apiCallQueue.forEach(call => call());
    this._apiCallQueue = [];
  }

  public get api() {
    return this._api;
  }

  public get isConnected() {
    return this._isConnected && this._interface.isConnected;
  }

  public connect = async () => {
    // if we're already connecting or connected, don't do anything
    if (this._isConnecting || this._isConnected) return;

    // allow the interface to do any setup it needs to do
    this._interface.connect();

    const rpcConnectRequest = createRpcConnectRequest({
      namespace: this._options?.namespace,
    });

    // set the connecting flag
    this._isConnecting = true;

    // wait for the connect response
    const availableMethods = await new Promise<string[]>((resolve, reject) => {

      // add the resolve and reject functions to the request callbacks map
      this._requestCallbacks.set('connect', [resolve, reject]);

      let retryCount = 0;
      const sendConnectRequest = () => {
        // send the connect request
        this._interface.sendMessage(rpcConnectRequest);
        retryCount++;
      }

      // send the connect request
      sendConnectRequest();
      // try more times in case the provider missed the first requests
      const timer = setInterval(() => {
        // if we're connected, stop trying
        if (this._isConnected) {
          clearInterval(timer);
        }

        // if we haven't gotten a response yet, try again
        else if (retryCount < CONNECT_RETRY_COUNT) {
          sendConnectRequest();
        }

        // if we've reached the max retry count, reject the promise
        else {
          clearInterval(timer);
          this._requestCallbacks.delete('connect');
          this._isConnected = false;
          this._isConnecting = false;
          reject(new Error(`Could not connect to provider ${this._options?.namespace ?? ''}`));
        }

      }, CONNECT_RETRY_INTERVAL);
    });

    // make sure the available methods set is cleared
    this._availableMethods.clear();
    // set the available methods
    availableMethods.forEach(method => this._availableMethods.add(method));

    // set the connected flag
    this._isConnected = true;
    // set the connecting flag
    this._isConnecting = false;

    // process any api calls that were queued up while we were connecting
    this._processApiCallQueue();
  }

  private _messageHandler = (message: unknown) => {

    // if the message is not an RPC message or is not for this namespace, ignore it
    if (!isRPCMessage(message)) return;

    // if the message is for a different namespace, ignore it
    if (message.namespace !== this._options?.namespace) return;

    if (isRPCResponse(message)) {
      // in this case we're just receiving a response from a request we made

      // get the callback for the request
      const [resolve, reject] = this._requestCallbacks.get(message.requestId) ?? [];
      if (!(resolve && reject)) return;
  
      // check if we got an error, and reject or resolve the promise
      if (message.error) {
        reject(message.result);
      } else {
        resolve(message.result);
      }
  
      // remove the callback
      this._requestCallbacks.delete(message.requestId);

    } else if (isRPCCallbackCall(message)) {
      // in this case we're receiving a call to a callback we passed to the parent

      // get the callback for the request
      const rpcCallback = this._rpcCallbacks.get(message.callbackId);
      if (!rpcCallback) return;
  
      // call the callback with the result
      rpcCallback(...message.payload as unknown[]);
    } else if (isRPCConnectResponse(message)) {
      // in this case we're receiving a response to our connect request

      // get the callback for the request
      const [resolve, reject] = this._requestCallbacks.get('connect') ?? [];
      if (!(resolve && reject)) return;
  
      // resolve the promise with the available methods
      resolve(message.methods);
  
      // remove the callback
      this._requestCallbacks.delete('connect');
    }

  }

  public call = async <MethodName extends keyof SourceApi>
  (
    method: MethodName,
    // we have to convert T to the TransframeConsumerApi type so that we skip the first `fromId` parameter
    ...payload: Parameters<TransframeConsumerApi<SourceApi>[MethodName]>
  ) => {

    if (!this._isConnected && !this._isConnecting) {
      throw new Error('Cannot call any api methods: Not connected to provider');
    } else if (this._isConnecting) {
      // if we're connecting, queue up the call and await a promise that will resolve when the connection is complete
      await new Promise((resolve) => {
        this._apiCallQueue.push(resolve);
      });
    }

    // convert the method to a string in case that's necessary
    const methodString = String(method);

    // if the method is not available, throw an error
    if (!this._availableMethods.has(methodString)) {
      throw new Error(`Method ${methodString} is not available`);
    }

    // filter out any callbacks and store them
    const modifiedPayload = payload.map((param) => {
      if (typeof param === "function") {

        // store the callback
        const callbackId = generateId()
        this._rpcCallbacks.set(callbackId, param);

        // replace the callback with a placeholder to send to the parent
        return createRpcCallbackPlaceholder(callbackId);
      } else {
        return param;
      }
    }) as Parameters<TransframeConsumerApi<SourceApi>[MethodName]>;

    // create the request and send it
    const rpcRequest = createRpcRequest({
      method: methodString,
      payload: modifiedPayload,
      namespace: this._options?.namespace
    });
    this._interface.sendMessage(rpcRequest);

    // wait for the response
    const result = await Promise.race([
      // wait for the response
      new Promise((resolve, reject) => {
        this._requestCallbacks.set(rpcRequest.requestId, [resolve, reject]);
      }),

      // race with a timeout
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("RPC request timed out. Check that you can connect to the provider and that the method exists."));
        }, this._options?.apiCallTimeout ?? DEFAULT_API_CALL_TIMEOUT);
      })
    ])

    return result as ReturnType<SourceApi[MethodName]>;
  }

}