export enum RPCMessageType {
  RPC_REQUEST = 'rpc-request',
  RPC_RESPONSE = 'rpc-response',
  RPC_CALLBACK_CALL = 'rpc-callback-call',
  RPC_CONNECT_REQUEST = 'rpc-connect-request',
  RPC_CONNECT_RESPONSE = 'rpc-connect-response',
}

export interface RPCMessage {
  /**
   * Magic property to identify this as a transframe RPC message
   */
  _transframe: true;

  /**
   * Identifies the type of message as an RPC request
   */
  type: RPCMessageType;

  /**
   * The namespace of the message. Providers/consumers can only 
   * communicate within the same namespace (if one is specified).
   */
  namespace?: string;
}

export interface RPCRequest extends RPCMessage {
  /**
   * The type of the message
   */
  type: RPCMessageType.RPC_REQUEST;

  /**
   * The id of the request
   */
  requestId: string;

  /**
   * The method to call
   */
  method: string;

  /**
   * The payload to pass to the method
   */
  payload: unknown;
}

export interface RPCResponse extends RPCMessage {
  /**
   * The type of the message
   */
  type: RPCMessageType.RPC_RESPONSE;

  /**
   * The id of the request
   */
  requestId: string;

  /**
   * The result of the request
   */
  result: unknown;

  /**
   * Whether or not the request errored
   */
  error: boolean;
}


export interface RPCCallbackCall extends RPCMessage {
  /**
   * The type of the message
   */
  type: RPCMessageType.RPC_CALLBACK_CALL;

  /**
   * The id of the callback
   */
  callbackId: string;

  /**
   * The payload to pass to the callback
   */
  payload: unknown;
}

export interface RPCConnectRequest extends RPCMessage {
  /**
   * The type of the message
   */
  type: RPCMessageType.RPC_CONNECT_REQUEST;
}

export interface RPCConnectResponse extends RPCMessage {
  /**
   * The type of the message
   */
  type: RPCMessageType.RPC_CONNECT_RESPONSE;

  /**
   * The list of methods that are available
   */
  methods: string[];
}

export interface RPCCallbackPlaceholderParam {
  /**
   * Magic property to identify this as a transframe RPC callback placeholder
   */
  _transframeCallback: true;

  /**
   * The id of the callback
   */
  callbackId: string;
}

export type RPCReplyFunction = (message: RPCResponse | RPCCallbackCall | RPCConnectResponse) => void;
