import { RPCReplyFunction } from "../../rpc/types";
import { TransframeProviderInterface } from "../types";

export class IframeProviderInterface implements TransframeProviderInterface<HTMLIFrameElement> {
  private _isListening: boolean;
  private _messageHandler: (message: unknown, reply: RPCReplyFunction, fromId?: string) => void;
  private _frames: Map<Window, string>;
  private _messageHandlerWrapper: (event: MessageEvent) => void;

  constructor() {
    this._isListening = false;
    this._messageHandler = () => {};
    this._frames = new Map();
    this._messageHandlerWrapper = (event) => {
      const fromWindow = this._frames.get(event.source as Window);
      const fromId = fromWindow == null ? undefined : fromWindow;

      this._messageHandler(
        JSON.parse(event.data),
        (message) => {
          event.source!.postMessage(JSON.stringify(message), event.origin as any);
        },
        fromId
      );
    };
  }

  public get isListening() {
    return this._isListening;
  }

  public listen() {
    window.addEventListener("message", this._messageHandlerWrapper);
    this._isListening = true;
  }

  public close() {
    window.removeEventListener("message", this._messageHandlerWrapper);
    this._isListening = false;
  }

  public onMessage(callback: (message: unknown, reply: RPCReplyFunction, fromId?: string) => void) {
    this._messageHandler = callback;
  }

  public registerFrame(frame: HTMLIFrameElement | null | undefined, id: string) {
    if (!frame?.contentWindow) {
      throw new Error("Frame must have a contentWindow");
    }
    this._frames.set(frame.contentWindow, id);
  }

}