import { RPCReplyFunction, RPCRequest } from "../rpc/types";

export interface TransframeProviderInterface<Frame> {
  isListening: boolean;
  listen: () => void;
  close: () => void;
  // not sure it makes sense having this
  // sendMessage: (payload: unknown, toId?: string) => void;
  onMessage(callback: (message: unknown, reply: RPCReplyFunction, fromId?: string) => void): void;
  registerFrame(frame: Frame, id: string): void;
}

export interface TransframeConsumerInterface {
  isConnected: boolean;
  connect: () => void;
  close: () => void;
  sendMessage: (message: RPCRequest) => void;
  onMessage(callback: (message: unknown) => void): void;
}