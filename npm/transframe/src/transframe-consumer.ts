import { TransframeConsumerInterface } from "./interfaces/types";
import { createRpcCallbackPlaceholder, createRpcRequest, isRPCCallbackCall, isRPCResponse } from "./rpc/util";
import { TransframeConsumerApi, TransframeConsumerOptions, TransframeSourceApi } from "./types";
import { generateId } from "./util";

export class TransframeConsumer<T extends TransframeSourceApi> {

  private _options?: TransframeConsumerOptions<T>;
  private _api: TransframeConsumerApi<T>;

  // map of request ids to callbacks; used to resolve promises
  private _requestCallbacks: Map<string, Function> = new Map();

  // if the user passes a callback in an api call, it'll be stored here
  // since we can't actually pass a function over the wire. The parent
  // will have to "call" our callback by sending us messages using the `rpc-callback` type
  private _rpcCallbacks: Map<string, Function> = new Map();

  constructor (
    private _interface: TransframeConsumerInterface,
    options?: TransframeConsumerOptions<T>
  ) {
    this._options = options;
    this._api = this._buildApi();

    // set up the message handler
    this._interface.onMessage(this._messageHandler);

    // connect immediately if the option is set
    if (options?.connectImmediately !== false) {
      this.connect();
    }
  }

  private _buildApi = () => {
    // create a proxy that will call the `call` method
    const api = new Proxy(
      {} as TransframeConsumerApi<T>,
      {
        get: (_target, prop: string) => {
          // whatever the property is, return a function that calls the `call` method
          return (...payload: Parameters<TransframeConsumerApi<T>[typeof prop]>) => this.call(prop, ...payload);
        }
      }
    );

    return api;
  }

  public get api() {
    return this._api;
  }

  public get isConnected() {
    return this._interface.isConnected;
  }

  public connect = () => {
    this._interface.connect();
  }

  private _messageHandler = (message: unknown) => {
    if (isRPCResponse(message)) {
      // in this case we're just receiving a response from a request we made

      // get the callback for the request
      const requestCallback = this._requestCallbacks.get(message.requestId);
      if (!requestCallback) return;
  
      // call the callback with the result
      requestCallback(message.result);
  
      // remove the callback
      this._requestCallbacks.delete(message.requestId);

    } else if (isRPCCallbackCall(message)) {
      // in this case we're receiving a call to a callback we passed to the parent

      // get the callback for the request
      const rpcCallback = this._rpcCallbacks.get(message.callbackId);
      if (!rpcCallback) return;
  
      // call the callback with the result
      rpcCallback(...message.payload as unknown[]);
    }

  }

  public call = async <MethodName extends keyof T>
  (
    method: MethodName,
    // we have to convert T to the TransframeConsumerApi type so that we skip the first `fromId` parameter
    ...payload: Parameters<TransframeConsumerApi<T>[MethodName]>
  ) => {

    // filter out any callbacks and store them
    payload = payload.map((param) => {
      if (typeof param === "function") {

        // store the callback
        const callbackId = generateId()
        this._rpcCallbacks.set(callbackId, param);

        // replace the callback with a placeholder to send to the parent
        return createRpcCallbackPlaceholder(callbackId);
      } else {
        return param;
      }
    }) as Parameters<TransframeConsumerApi<T>[MethodName]>;

    // create the request and send it
    const rpcRequest = createRpcRequest({ method: method as string, payload });
    this._interface.sendMessage(rpcRequest);

    // wait for the response;
    // this will be resolved by the message handler
    // TODO: add a timeout and possibly error handling
    const result = await new Promise((resolve, _reject) => {
      this._requestCallbacks.set(rpcRequest.requestId, resolve);
    })

    return result as ReturnType<T[MethodName]>;
  }

}