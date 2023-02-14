import { RPCRequest } from "../../rpc/types";
import { TransframeConsumerInterface } from "../types";
import Browser from "webextension-polyfill";
import { BackgroundScriptConsumerInterfaceOptions } from "./types";

export class BackgroundScriptConsumerInterface implements TransframeConsumerInterface {

  private _isConnected: boolean = false;
  private _messageHandler: (message: unknown) => void = () => {};
  private _port?: Browser.Runtime.Port;
  private _options?: BackgroundScriptConsumerInterfaceOptions;

  constructor(options?: BackgroundScriptConsumerInterfaceOptions) {
    this._options = options;
  }

  private _messageHandlerWrapper = (message: unknown) => {
    console.log('consumer receiving message', message)
    this._messageHandler(message);
  }

  public get isConnected() {
    return this._isConnected;
  }

  public connect() {
    this._port = Browser.runtime.connect({ name: this._options?.channelName ?? "transframe" });
    this._port.onMessage.addListener(this._messageHandlerWrapper);
    this._isConnected = true;
  }

  public close() {
    this._port?.onMessage.removeListener(this._messageHandlerWrapper);
    this._port?.disconnect();
    this._isConnected = false;
  }

  public sendMessage(message: RPCRequest) {
    this._port?.postMessage(message);
  }

  onMessage(callback: (message: unknown) => void): void {
    this._messageHandler = callback;
  }

}