import type { RPCReplyFunction } from "../rpc/types";
import type { Context } from "../types";

export interface TransframeProviderInterface<Frame, ContextType> {
  isListening: boolean;
  listen: () => void;
  close: () => void;
  // not sure it makes sense having this
  // sendMessage: (payload: unknown, toId?: string) => void;
  onMessage(callback: (message: unknown, reply: RPCReplyFunction, context: Context<ContextType>) => void): void;
  registerFrame(frame: Frame, id: string): void;
}

export interface TransframeConsumerInterface {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: unknown) => void;
  onMessage(callback: (message: unknown) => void): void;
}
