import { generateId } from "../util";
import { RPCCallbackCall, RPCCallbackPlaceholderParam, RPCConnectRequest, RPCConnectResponse, RPCMessage, RPCMessageType, RPCRequest, RPCResponse } from "./types";

export function createRpcConnectRequest({
  namespace,
}: {
  namespace?: string;
}): RPCConnectRequest{
  return {
    _transframe: true,
    type: RPCMessageType.RPC_CONNECT_REQUEST,
    namespace,
  }
}

export function createRpcConnectResponse({
  namespace,
  methods
}: {
  namespace?: string;
  methods: string[];
}): RPCConnectResponse {
  return {
    _transframe: true,
    type: RPCMessageType.RPC_CONNECT_RESPONSE,
    namespace,
    methods,
  }
}

/**
 * Creates an rpc request
 */
export function createRpcRequest ({
  requestId,
  method,
  payload,
  namespace
}: {
  requestId?: string;
  method: string;
  payload: unknown;
  namespace?: string;
}): RPCRequest {
  return {
    _transframe: true,
    type: RPCMessageType.RPC_REQUEST,
    requestId: requestId ?? generateId(),
    method,
    payload,
    namespace,
  };
}

/**
 * Creates an rpc response
 */
export function createRpcResponse ({
  requestId,
  result,
  error = false,
  namespace
}: {
  requestId: string;
  result: unknown;
  error?: boolean;
  namespace?: string;
}): RPCResponse {
  return {
    _transframe: true,
    type: RPCMessageType.RPC_RESPONSE,
    requestId,
    result,
    error,
    namespace,
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
export function createRpcCallbackCall ({
  callbackId,
  payload,
  namespace
}: {
  callbackId: string;
  payload: unknown;
  namespace?: string;
}
): RPCCallbackCall {
  return {
    _transframe: true,
    type: RPCMessageType.RPC_CALLBACK_CALL,
    callbackId,
    payload,
    namespace,
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

export function isRPCConnectRequest (payload: any): payload is RPCConnectRequest {
  return isRPCMessage(payload) &&
    payload.type === RPCMessageType.RPC_CONNECT_REQUEST;
}

export function isRPCConnectResponse (payload: any): payload is RPCConnectResponse {
  return isRPCMessage(payload) &&
    payload.type === RPCMessageType.RPC_CONNECT_RESPONSE;
}