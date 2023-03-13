import Browser from "webextension-polyfill";
import { RPCReplyFunction } from "../../rpc/types";
import { Context } from "../../types";
import { TransframeProviderInterface } from "../types";
import { BackgroundScriptInterfaceContext } from "./types";

export class BackgroundScriptProviderInterface implements 
  TransframeProviderInterface<never, BackgroundScriptInterfaceContext> {

  private _isListening: boolean = false;
  private _messageHandler: (message: unknown, reply: RPCReplyFunction, context: Context<BackgroundScriptInterfaceContext>) => void = () => {};

  private _messageHandlerWrapper = (port: Browser.Runtime.Port, message: unknown) => {

    // if the consumer disconnects, we should disable the reply function
    let isConnected = true;
    port.onDisconnect.addListener(() => {
      isConnected = false;
    });

    // the user will use this to reply to the consumer
    const replyFn: RPCReplyFunction = (message) => {
      // only send the message if the consumer is still connected
      if (isConnected) port.postMessage(message);
    };

    // I'm not sure what we should use to identify the consumer...
    const fromId = undefined;

    const context: Context<BackgroundScriptInterfaceContext> = {
      fromId,
      port
    };

    // call the message handler set by the user
    this._messageHandler(message, replyFn, context);
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

  onMessage(callback: (message: unknown, reply: RPCReplyFunction, context: Context<BackgroundScriptInterfaceContext>) => void): void {
    this._messageHandler = callback;
  }
  registerFrame(frame: never, id: string): void {
    throw new Error("Method not implemented.");
  }

}