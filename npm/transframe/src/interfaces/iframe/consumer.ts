import type { TransframeConsumerInterface } from "../types";
import type { IframeConsumerInterfaceOptions } from "./types";

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
      // only process messages from the allowed origins
      if (this._options?.allowedOrigins && !this._options.allowedOrigins.includes(event.origin)) {
        return;
      }

      this._messageHandler(event.data);
    };
  }

  public get isConnected() {
    return this._isConnected;
  }

  public connect() {
    window.addEventListener("message", this._messageHandlerWrapper);
    this._isConnected = true;
  }

  public disconnect() {
    window.removeEventListener("message", this._messageHandlerWrapper);
    this._isConnected = false;
  }

  public sendMessage(message: unknown) {

    // default to using the top most window as the provider unless the user specified otherwise
    let providerWindow: Window | null;
    if (this._options?.providerWindow) {
      providerWindow = this._options.providerWindow;
    } else if (this._options?.useDirectParent) {
      providerWindow = window.parent;
    } else {
      providerWindow = window.top;
    }

    if (!providerWindow) {
      throw new Error("No parent window to send message to");
    }

    if (this._options?.allowedOrigins) {
      // if they specified a list of allowed origins, only send the message to those origins;
      // we don't know which origin the provider is on, so we have to send it to all of them
      this._options.allowedOrigins.forEach((origin) => {
        // I don't know why, but typescript thinks providerWindow can be null here
        providerWindow!.postMessage(message, origin);
      });
    } else {
      // if they didn't specify a list of allowed origins, send the message to all origins
      providerWindow.postMessage(message, "*");
    }
  }

  public onMessage(callback: (message: unknown) => void) {
    this._messageHandler = callback;
  }
}
