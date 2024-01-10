import type { TransframeConsumerInterface } from "../types";
import Browser from "webextension-polyfill";
import type { BackgroundScriptConsumerInterfaceOptions } from "./types";

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

      // if we get unexpectedly disconnected, reconnect
      this._port.onDisconnect.addListener(() => {
        // if we intentionally disconnected, this._isConnected will already be false
        if (!this._isConnected) return;
        this._isConnected = false;
        this.connect();
      });
    };

    // If the document is pre-rendering do NOT connect right away;
    // There's some weird behavior where the port disconnects immediately
    // upon loading the page after prerendering.
    // See this post for more info: https://groups.google.com/a/chromium.org/g/chromium-extensions/c/gHAEKspcdRY
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

  public disconnect() {
    this._port?.onMessage.removeListener(this._messageHandlerWrapper);
    this._port?.disconnect();
    this._isConnected = false;
  }

  public sendMessage(message: unknown) {
    this._port?.postMessage(message);
  }

  onMessage(callback: (message: unknown) => void): void {
    this._messageHandler = callback;
  }
}
