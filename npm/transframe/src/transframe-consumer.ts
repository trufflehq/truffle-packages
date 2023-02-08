import { TransframeConsumerInterface } from "./interfaces/types";
import { createRpcCallbackPlaceholder, createRpcRequest, isRPCCallbackCall, isRPCResponse } from "./rpc/util";
import { TransframeConsumerApi, TransframeConsumerOptions, TransframeSourceApi } from "./types";
import { generateId } from "./util";

const DEFAULT_API_CALL_TIMEOUT = 5000;

// a tuple of resolve and reject functions
type ResolveReject = [Function, Function];
export class TransframeConsumer<T extends TransframeSourceApi> {

  private _options?: TransframeConsumerOptions<T>;
  private _api: TransframeConsumerApi<T>;

  // map of request ids to callbacks; used to resolve/reject promises
  private _requestCallbacks: Map<string, ResolveReject> = new Map();

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
    if (this._options?.connectImmediately !== false) {
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

    return result as ReturnType<T[MethodName]>;
  }

}