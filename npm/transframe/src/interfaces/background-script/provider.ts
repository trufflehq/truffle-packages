import Browser from "webextension-polyfill";
import { RPCReplyFunction } from "../../rpc/types";
import { TransframeProviderInterface } from "../types";

export class BackgroundScriptProviderInterface implements TransframeProviderInterface<never> {

  private _isListening: boolean = false;
  private _messageHandler: (message: unknown, reply: RPCReplyFunction, fromId?: string) => void = () => {};

  private _messageHandlerWrapper = (port: Browser.Runtime.Port, message: unknown) => {
    // the user will use this to reply to the consumer
    const replyFn: RPCReplyFunction = (message) => {
      port.postMessage(message);
    };

    // I'm not sure what we should use to identify the consumer...
    const fromId = undefined;

    // call the message handler set by the user
    this._messageHandler(message, replyFn, fromId);
  };

  private _connectionListener = (port: Browser.Runtime.Port) => {
    port.onMessage.addListener((message) => {
      this._messageHandlerWrapper(port, message);
    });
  }

  public get isListening() {
    return this._isListening;
  }

  public listen() {
    Browser.runtime.onConnect.addListener(this._connectionListener);
    this._isListening = true;
  }

  public close() {
    Browser.runtime.onConnect.removeListener(this._connectionListener);
    this._isListening = false;
  }

  onMessage(callback: (message: unknown, reply: RPCReplyFunction, fromId?: string | undefined) => void): void {
    this._messageHandler = callback;
  }
  registerFrame(frame: never, id: string): void {
    throw new Error("Method not implemented.");
  }

}