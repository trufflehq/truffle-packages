/*
 * Child {RPCRequest} -> Parent
 *   Parent {RPCRequestAcknowledgement} -> Child
 *   Parent {RPCResponse} -> Child
 *
 * Child {RPCRequest:{params:[RPCCallback]}} -> Parent
 *   Parent {RPCRequestAcknowledgement} -> Child
 *   Parent {RPCResponse} -> Child
 *   Parent {RPCCallbackResponse} -> Child
 *   Parent {RPCCallbackResponse} -> Child
 *
 * Parent {RPCError} -> Child
 *
 *
 * _browserComms is added to denote a portal-gun message
 * RPCRequestAcknowledgement is to ensure the responder recieved the request
 * RPCCallbackResponse is added to support callbacks for methods
 *
 * params, if containing a callback function, will have that method replaced
 * with RPCCallback which should be used to emit callback responses
 */

export const ERROR_CODES = {
  METHOD_NOT_FOUND: -32601,
  INVALID_ORIGIN: 100,
  DEFAULT: -1,
};

const ERROR_MESSAGES = {};
ERROR_MESSAGES[ERROR_CODES.METHOD_NOT_FOUND] = "Method not found";
ERROR_MESSAGES[ERROR_CODES.INVALID_ORIGIN] = "Invalid origin";
ERROR_MESSAGES[ERROR_CODES.DEFAULT] = "Error";

const DEFAULT_REQUEST_TIMEOUT_MS = 3000;

const deferredFactory = function () {
  let resolve = null;
  let reject = null;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
    return reject;
  });
  promise.resolve = resolve;
  promise.reject = reject;

  return promise;
};

export default class RPCClient {
  constructor({ postMessage, timeout = DEFAULT_REQUEST_TIMEOUT_MS } = {}) {
    this.postMessage = postMessage;
    this.timeout = timeout;
    this.pendingRequests = {};
    this.callbackFunctions = {};
    this.call = this.call.bind(this);
    this.resolve = this.resolve.bind(this);
    this.resolveRPCResponse = this.resolveRPCResponse.bind(this);
  }

  /*
  @param {String} method
  @param {Array<*>} [params]
  @returns {Promise}
  */
  call(method, reqParams, options = {}) {
    const { timeout = this.timeout } = options;
    const deferred = deferredFactory();
    const params = [];

    // replace callback params
    for (const param of Array.from(reqParams || [])) {
      if (typeof param === "function") {
        const callback = createRPCCallback(param);
        this.callbackFunctions[callback.callbackId] = param;
        params.push(callback);
      } else {
        params.push(param);
      }
    }

    const request = createRPCRequest({ method, params });

    this.pendingRequests[request.id] = {
      reject: deferred.reject,
      resolve: deferred.resolve,
      isAcknowledged: false,
    };

    try {
      this.postMessage(JSON.stringify(request), "*");
    } catch (err) {
      deferred.reject(err);
      return deferred;
    }

    setTimeout(() => {
      if (!this.pendingRequests[request.id].isAcknowledged) {
        return deferred.reject(new Error("Message Timeout"));
      }
    }, timeout);

    return deferred;
  }

  /*
  @param {RPCResponse|RPCRequestAcknowledgement|RPCCallbackResponse} response
  */
  resolve(response) {
    switch (false) {
      case !isRPCRequestAcknowledgement(response):
        return this.resolveRPCRequestAcknowledgement(response);
      case !isRPCResponse(response):
        return this.resolveRPCResponse(response);
      case !isRPCCallbackResponse(response):
        return this.resolveRPCCallbackResponse(response);
      default:
        throw new Error("Unknown response type");
    }
  }

  /*
  @param {RPCResponse} rPCResponse
  */
  resolveRPCResponse(rPCResponse) {
    const request = this.pendingRequests[rPCResponse.id];
    if (request == null) {
      throw new Error("Request not found");
    }

    request.isAcknowledged = true;

    const { result, error } = rPCResponse;
    if (error) {
      request.reject(error.data || new Error(error.message));
    } else if (result != null) {
      request.resolve(result);
    } else {
      request.resolve(null);
    }
    return null;
  }

  /*
  @param {RPCRequestAcknowledgement} rPCRequestAcknowledgement
  */
  resolveRPCRequestAcknowledgement(rPCRequestAcknowledgement) {
    const request = this.pendingRequests[rPCRequestAcknowledgement.id];
    if (request == null) {
      throw new Error("Request not found");
    }

    request.isAcknowledged = true;
    return null;
  }

  /*
  @param {RPCCallbackResponse} rPCCallbackResponse
  */
  resolveRPCCallbackResponse(rPCCallbackResponse) {
    const callbackFn = this.callbackFunctions[rPCCallbackResponse.callbackId];
    if (callbackFn == null) {
      throw new Error("Callback not found");
    }

    callbackFn(...(rPCCallbackResponse.params || []));
    return null;
  }
}

/*
  @typedef {Object} RPCCallbackResponse
  @property {Boolean} _browserComms - Must be true
  @property {String} callbackId
  @property {Array<*>} params

  @param {Object} props
  @param {Array<*>} props.params
  @param {String} props.callbackId
  @returns RPCCallbackResponse
  */
export function createRPCCallbackResponse({ params, callbackId }) {
  return { _browserComms: true, callbackId, params };
}

/*
  @typedef {Object} RPCRequestAcknowledgement
  @property {Boolean} _browserComms - Must be true
  @property {String} id
  @property {Boolean} acknowledge - must be true

  @param {Object} props
  @param {String} props.responseId
  @returns RPCRequestAcknowledgement
  */
export function createRPCRequestAcknowledgement({ requestId }) {
  return { _browserComms: true, id: requestId, acknowledge: true };
}

/*
  @typedef {Object} RPCResponse
  @property {Boolean} _browserComms - Must be true
  @property {String} id
  @property {*} result
  @property {RPCError} error

  @param {Object} props
  @param {String} props.requestId
  @param {*} [props.result]
  @param {RPCError|Null} [props.error]
  @returns RPCResponse
  */
export function createRPCResponse({
  requestId,
  result = null,
  rPCError = null,
}) {
  return { _browserComms: true, id: requestId, result, error: rPCError };
}

/*
  @typedef {Object} RPCError
  @property {Boolean} _browserComms - Must be true
  @property {Integer} code
  @property {String} message
  @property {Object} data - optional

  @param {Object} props
  @param {Errpr} [props.error]
  @returns RPCError
  */
export function createRPCError({ code, data = null }) {
  const message = ERROR_MESSAGES[code];
  return { _browserComms: true, code, message, data };
}

export function isRPCEntity(entity) {
  return entity?._browserComms;
}

export function isRPCRequest(request) {
  return request?.id != null && request.method != null;
}

export function isRPCResponse(response) {
  return (
    response?.id &&
    (response.result !== undefined || response.error !== undefined)
  );
}

/*
  @typedef {Object} RPCCallback
  @property {Boolean} _browserComms - Must be true
  @property {String} callbackId
  @property {Boolean} _browserCommsGunCallback - Must be true

  @returns RPCCallback
  */
export function createRPCCallback() {
  return {
    _browserComms: true,
    _browserCommsGunCallback: true,
    callbackId: generateUuid(),
  };
}

/*
  @typedef {Object} RPCRequest
  @property {Boolean} _browserComms - Must be true
  @property {String} id
  @property {String} method
  @property {Array<*>} params

  @param {Object} props
  @param {String} props.method
  @param {Array<*>} [props.params] - Functions are not allowed
  @returns RPCRequest
  */
export function createRPCRequest({ method, params }) {
  if (params == null) {
    throw new Error("Must provide params");
  }

  for (const param of Array.from(params)) {
    if (typeof param === "function") {
      throw new Error("Functions are not allowed. Use RPCCallback instead.");
    }
  }

  return { _browserComms: true, id: generateUuid(), method, params };
}

export function isRPCRequestAcknowledgement(ack) {
  return ack?.acknowledge === true;
}

export function isRPCCallbackResponse(response) {
  return response?.callbackId && response.params != null;
}

export function isRPCCallback(callback) {
  return callback?._browserCommsGunCallback;
}

// https://stackoverflow.com/a/8809472
function generateUuid() {
  // Public Domain/MIT
  let d = new Date().getTime();
  let d2 = (typeof performance !== "undefined" &&
    performance.now &&
    performance.now() * 1000) ||
    0; // Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;
    if (d > 0) {
      // Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
