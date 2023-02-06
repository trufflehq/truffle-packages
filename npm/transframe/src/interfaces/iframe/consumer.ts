import { RPCRequest } from "../../rpc/types";
import { TransframeConsumerInterface } from "../types";

export class IframeConsumerInterface implements TransframeConsumerInterface {
  private _isConnected: boolean;
  private _messageHandler: (message: unknown) => void;
  private _messageHandlerWrapper: (event: MessageEvent) => void;

  constructor() {
    this._isConnected = false;
    this._messageHandler = () => {};
    this._messageHandlerWrapper = (event) => {
      this._messageHandler(JSON.parse(event.data));
    };

    // TODO: add an option that allows the user to decide whether to connect automatically; `autoConnect`?
    this.connect();
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
    // TODO: implement allowOrigins option
    window.top?.postMessage(JSON.stringify(message), "*");
  }

  public onMessage(callback: (message: unknown) => void) {
    this._messageHandler = callback;
  }
}