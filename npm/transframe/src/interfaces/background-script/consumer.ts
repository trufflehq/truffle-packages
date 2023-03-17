import { RPCRequest } from "../../rpc/types";
import { TransframeConsumerInterface } from "../types";
import Browser from "webextension-polyfill";
import { BackgroundScriptConsumerInterfaceOptions } from "./types";

export class BackgroundScriptConsumerInterface
  implements TransframeConsumerInterface
{
  private _isConnected: boolean = false;
  private _messageHandler: (message: unknown) => void = () => {};
  private _port?: Browser.Runtime.Port;
  private _options?: BackgroundScriptConsumerInterfaceOptions;

  constructor(options?: BackgroundScriptConsumerInterfaceOptions) {
    this._options = options;
  }

  private _messageHandlerWrapper = (message: unknown) => {
    this._messageHandler(message);
  };

  public get isConnected() {
    return this._isConnected;
  }

  public connect() {
    const _connect = () => {
      this._port = Browser.runtime.connect({
        name: this._options?.channelName ?? "transframe",
      });
      this._port.onMessage.addListener(this._messageHandlerWrapper);
      this._isConnected = true;
    };

    // If the document is pre-rendering do NOT connect right away;
    // There's some weird behavior where the port disconnects immediately
    // upon loading the page after prerendering.
    const document = window.document as Document & { prerendering: boolean };
    if (document.prerendering) {
      document.addEventListener("prerenderingchange", () => {
        if (!document.prerendering) {
          _connect();
        }
      });
    } else {
      _connect();
    }
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
