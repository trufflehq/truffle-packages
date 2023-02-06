import { RPCRequest } from "../../rpc/types";
import { TransframeConsumerInterface } from "../types";
import { IframeConsumerInterfaceOptions } from "./types";

export class IframeConsumerInterface implements TransframeConsumerInterface {
  private _isConnected: boolean;
  private _messageHandler: (message: unknown) => void;
  private _messageHandlerWrapper: (event: MessageEvent) => void;
  private _options?: IframeConsumerInterfaceOptions;

  constructor(options?: IframeConsumerInterfaceOptions) {
    this._options = options;
    this._isConnected = false;
    this._messageHandler = () => {};
    this._messageHandlerWrapper = (event) => {
      this._messageHandler(JSON.parse(event.data));
    };
  }

  public get isConnected() {
    return this._isConnected;
  }

  public connect() {
    window.addEventListener("message", this._messageHandlerWrapper);
    this._isConnected = true;
  }

  public close() {
    window.removeEventListener("message", this._messageHandlerWrapper);
    this._isConnected = false;
  }

  public sendMessage(message: RPCRequest) {

    // default to using the top most window as the provider unless the user specified otherwise
    const providerWindow = this._options?.useDirectParent ? window.parent : window.top;

    if (!providerWindow) {
      throw new Error("No parent window to send message to");
    }

    if (this._options?.allowedOrigins) {
      // if they specified a list of allowed origins, only send the message to those origins;
      // we don't know which origin the provider is on, so we have to send it to all of them
      this._options.allowedOrigins.forEach((origin) => {
        providerWindow.postMessage(JSON.stringify(message), origin);
      });
    } else {
      // if they didn't specify a list of allowed origins, send the message to all origins
      providerWindow.postMessage(JSON.stringify(message), "*");
    }
  }

  public onMessage(callback: (message: unknown) => void) {
    this._messageHandler = callback;
  }
}