import { generateId } from "../util";
import { RPCCallbackCall, RPCCallbackPlaceholderParam, RPCMessage, RPCMessageType, RPCRequest, RPCResponse } from "./types";

/**
 * Creates an rpc request
 */
export function createRpcRequest ({
  requestId,
  method,
  payload,
}: {
  requestId?: string;
  method: string;
  payload: unknown;
}): RPCRequest {
  return {
    _transframe: true,
    type: RPCMessageType.RPC_REQUEST,
    requestId: requestId ?? generateId(),
    method,
    payload,
  };
}

/**
 * Creates an rpc response
 */
export function createRpcResponse ({
  requestId,
  result,
  error = false,
}: {
  requestId: string;
  result: unknown;
  error?: boolean;
}): RPCResponse {
  return {
    _transframe: true,
    type: RPCMessageType.RPC_RESPONSE,
    requestId,
    result,
    error,
  };
}

/**
 * Creates an rpc callback placeholder
 */
export function createRpcCallbackPlaceholder (callbackId: string): RPCCallbackPlaceholderParam {
  return {
    _transframeCallback: true,
    callbackId,
  };
}

/**
 * Creates an rpc callback call
 */
export function createRpcCallbackCall (callbackId: string, payload: unknown): RPCCallbackCall {
  return {
    _transframe: true,
    type: RPCMessageType.RPC_CALLBACK_CALL,
    callbackId,
    payload,
  }
}

export function isRPCMessage (payload: any): payload is RPCMessage {
  return payload?._transframe === true;
}

export function isRPCRequest (payload: any): payload is RPCRequest {
  return isRPCMessage(payload) &&
    payload.type === RPCMessageType.RPC_REQUEST;
}

export function isRPCResponse (payload: any): payload is RPCResponse {
  return isRPCMessage(payload) &&
    payload.type === RPCMessageType.RPC_RESPONSE;
}

export function isRPCCallbackCall (payload: any): payload is RPCCallbackCall {
  return isRPCMessage(payload) &&
    payload.type === RPCMessageType.RPC_CALLBACK_CALL;
}

export function isRPCCallbackPlaceholder (payload: any): payload is RPCCallbackPlaceholderParam {
  return payload?._transframeCallback === true;
}