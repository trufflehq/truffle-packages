import type { RPCReplyFunction } from "../../rpc/types";
import type { Context } from "../../types";
import type { TransframeProviderInterface } from "../types";
import type { IframeInterfaceContext, IframeProviderInterfaceOptions } from "./types";

export class IframeProviderInterface implements
  TransframeProviderInterface<HTMLIFrameElement, IframeInterfaceContext> {

  private _isListening: boolean = false;
  private _messageHandler: (message: unknown, reply: RPCReplyFunction, context: Context<IframeInterfaceContext>) => void = () => {};
  private _frameIdMap: Map<Window, string> = new Map();
  private _options?: IframeProviderInterfaceOptions;

  constructor(options?: IframeProviderInterfaceOptions) {
    this._options = options;
  }

  private _messageHandlerWrapper = (event: MessageEvent) => {

    // only process messages from the allowed origins
    if (this._options?.allowedOrigins && !this._options.allowedOrigins.includes(event.origin)) {
      return;
    }

    // according to typescript, this can be null?
    const eventSource = event.source;
    if (!eventSource) {
      throw new Error("Somehow the event source is null");
    }

    // get the id of the frame that sent the message
    const fromId = this._frameIdMap.get(event.source as Window);
    const context: Context<IframeInterfaceContext> = {
      fromId,
      event
    };

    // the user will use this to reply to the consumer
    const replyFn: RPCReplyFunction = (message) => {
      eventSource.postMessage(message, event.origin as any);
    };

    // call the message handler set by the user
    this._messageHandler(
      event.data,
      replyFn,
      context
    );
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

  public onMessage(callback: (message: unknown, reply: RPCReplyFunction, context: Context<IframeInterfaceContext>) => void, ) {
    this._messageHandler = callback;
  }

  public registerFrame(frame: HTMLIFrameElement, id: string) {
    if (!frame?.contentWindow) {
      throw new Error("Frame must have a contentWindow");
    }
    this._frameIdMap.set(frame.contentWindow, id);
  }

}
