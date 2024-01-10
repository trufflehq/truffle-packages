import Browser from "webextension-polyfill";
import type { RPCReplyFunction } from "../../rpc/types";
import type { Context } from "../../types";
import type { TransframeProviderInterface } from "../types";
import type { BackgroundScriptInterfaceContext, ModifiedPort } from "./types";

export class BackgroundScriptProviderInterface implements 
  TransframeProviderInterface<never, BackgroundScriptInterfaceContext> {

  private _isListening: boolean = false;
  private _messageHandler: (message: unknown, reply: RPCReplyFunction, context: Context<BackgroundScriptInterfaceContext>) => void = () => {};

  private _messageHandlerWrapper = (port: ModifiedPort, message: unknown) => {    
    // the user will use this to reply to the consumer
    const replyFn: RPCReplyFunction = (message) => {
      // only send the message if the consumer is still connected
      if (port.sender) port.postMessage(message);
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

  private _deleteTimer = (port: ModifiedPort) => {
    clearTimeout(port._timer);
    delete port._timer;
  }

  private _forceReconnect = (port: ModifiedPort) => {    
    this._deleteTimer(port);
    port.disconnect();
  }
  
  private _connectionListener = (port: ModifiedPort) => {
    port.onMessage.addListener((message) => {
      this._messageHandlerWrapper(port, message);
    });
    // force a reconnect every 250 seconds to keep service worker alive if the consumer is still connected
    // https://stackoverflow.com/a/66618269
    port._timer = setTimeout(this._forceReconnect, 250e3, port);
    port.onDisconnect.addListener(this._deleteTimer);
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
  registerFrame(_frame: never, _id: string): void {
    throw new Error("Method not implemented.");
  }

}
