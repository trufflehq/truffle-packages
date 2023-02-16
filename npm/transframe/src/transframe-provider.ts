import { TransframeProviderInterface } from "./interfaces/types";
import { RPCReplyFunction } from "./rpc/types";
import { createRpcCallbackCall, createRpcResponse, isRPCCallbackPlaceholder, isRPCRequest } from "./rpc/util";
import { TransframeProviderOptions } from "./types";
import { generateId } from "./util";

export class TransframeProvider<Frame> {

  private _options: TransframeProviderOptions;

  constructor (
    private _interface: TransframeProviderInterface<Frame>,
    options: TransframeProviderOptions
  ) {
    this._options = options;

    // set up the message handler
    this._interface.onMessage(this._messageHandler);

    // listen immediately if the user wants to;
    // default to true
    if (this._options.listenImmediately ?? true) {
      this.listen();
    }
  }

  public registerFrame = (frame: Frame, id?: string) => {
    id ??= generateId();
    this._interface.registerFrame(frame, id);
    return id;
  }

  public listen = () => {
    this._interface.listen();
  }

  public get isListening() {
    return this._interface.isListening;
  }

  public close = () => {
    this._interface.close();
  }

  public get api() {
    return this._options.api;
  }

  private _messageHandler = async (
    message: unknown,
    reply: RPCReplyFunction,
    fromId?: string
  ) => {
    
    // if the message is not an RPC request, ignore it
    if (!isRPCRequest(message)) return;

    // if the message is not for this namespace, ignore it
    if (message.namespace !== this._options.namespace) return;

    // if strict mode is enabled, make sure to only handle messages if fromId is defined
    if (this._options.strictMode && fromId == null) return;

    // filter out any callback placeholders and replace them
    // with methods that make rpc calls back to the consumer
    const modifiedPayload = (message.payload as unknown[]).map((param) => {
      if (isRPCCallbackPlaceholder(param)) {
        const callbackId = param.callbackId;

        // create a callback function that will send a message
        // back to the consumer
        const callback = (...args: unknown[]) => {
          const callbackCall = createRpcCallbackCall({
            callbackId,
            payload: args,
            namespace: this._options.namespace
          });
          reply(callbackCall);
        };

        // replace the placeholder with the callback function
        return callback;

      } else {
        // if it's not a callback placeholder, just return the original param
        return param;
      }
    });

    // call the method and get the result
    const method = this._options.api[message.method] as (...args: unknown[]) => Promise<unknown>;
    if (!method) return;

    let didError = false;
    let result: unknown;
    try {
      result = await method(fromId, ...modifiedPayload);
    } catch (err) {
      didError = true;
      result = err;
    }

    // create the response and send it back
    const response = createRpcResponse({
      requestId: message.requestId,
      result,
      error: didError,
      namespace: this._options.namespace
    });
    reply(response);
  }

}