/* global self */
import RPCClient, {
  createRPCCallbackResponse,
  createRPCError,
  createRPCRequestAcknowledgement,
  createRPCResponse,
  ERROR_CODES,
  isRPCCallback,
  isRPCEntity,
  isRPCRequest,
  isRPCResponse,
} from "./rpc_client.ts";

const DEFAULT_HANDSHAKE_TIMEOUT_MS = 10000; // 10 seconds
const SW_CONNECT_TIMEOUT_MS = 5000; // 5s

const selfWindow = typeof document !== "undefined"
  ? window
  : typeof self !== "undefined"
  ? self
  : null;

class BrowserComms {
  /*
  @param {Object} options
  @param {Number} [options.timeout] - request timeout (ms)
  @param {Number} [options.handShakeTimeout=10000] - handshake timeout (ms)
  @param {Boolean} [options.shouldConnectToServiceWorker] - whether or not we should try comms with service worker
  @param {Function<Boolean>} options.isParentValidFn - restrict parent origin
  */
  constructor(options = {}) {
    const {
      timeout,
      shouldConnectToServiceWorker,
      handshakeTimeout = DEFAULT_HANDSHAKE_TIMEOUT_MS,
      isParentValidFn = () => true,
    } = options;
    this.handshakeTimeout = handshakeTimeout;
    this.isParentValidFn = isParentValidFn;
    this.isListening = false;
    // window?._browserCommsIsInAppBrowser is set by native app. on iOS it isn't set
    // soon enough, so we rely on userAgent
    const isInAppBrowser = globalThis?.window?._browserCommsIsInAppBrowser ||
      (globalThis?.navigator?.userAgent.indexOf("/InAppBrowser") !== -1);
    this.hasParent =
      ((typeof document !== "undefined") && (window.self !== window.top)) ||
      isInAppBrowser;
    this.parent = globalThis?.window?.parent;

    this.client = new RPCClient({
      timeout,
      postMessage: (msg, origin) => {
        if (isInAppBrowser) {
          let queue = (() => {
            try {
              return JSON.parse(window.localStorage["portal:queue"]);
            } catch (error) {
              return null;
            }
          })();
          if (queue == null) queue = [];
          queue.push(msg);
          window.localStorage["portal:queue"] = JSON.stringify(queue);
          return window.localStorage["portal:queue"];
        } else {
          return this.parent?.postMessage(msg, origin);
        }
      },
    });

    if (shouldConnectToServiceWorker) {
      // only use service workers if current page has one we care about
      this.ready = waitForServiceWorker();
    } else {
      this.ready = Promise.resolve(true);
    }

    // All parents must respond to 'ping' with @registeredMethods
    this.registeredMethods = {
      ping: () => Object.keys(this.registeredMethods),
    };
    this.parentsRegisteredMethods = [];
    this.setParent = this.setParent.bind(this);
    this.setInAppBrowserWindow = this.setInAppBrowserWindow.bind(this);
    this.replyInAppBrowserWindow = this.replyInAppBrowserWindow.bind(this);
    this.onMessageInAppBrowserWindow = this.onMessageInAppBrowserWindow.bind(
      this,
    );
    this.listen = this.listen.bind(this);
    this.close = this.close.bind(this);
    this.call = this.call.bind(this);
    this.onRequest = this.onRequest.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.on = this.on.bind(this);
  }

  setParent(parent) {
    this.parent = parent;
    this.hasParent = true;
  }

  setInAppBrowserWindow(iabWindow, callback) {
    // can't use postMessage, so this hacky executeScript works
    this.iabWindow = iabWindow;
    const readyEvent = navigator.userAgent.indexOf("iPhone") !== -1
      ? "loadstop" // for some reason need to wait for this on iOS
      : "loadstart";
    this.iabWindow.addEventListener(readyEvent, () => {
      this.iabWindow.executeScript({
        code: "window._browserCommsIsInAppBrowser = true;",
      });
      clearInterval(this.iabInterval);
      this.iabInterval = setInterval(() => {
        return this.iabWindow.executeScript({
          code: "window.localStorage.getItem('portal:queue');",
        }, (values) => {
          try {
            values = JSON.parse(values?.[0]);
            if (values && values.length) {
              this.iabWindow.executeScript({
                code: "window.localStorage.setItem('portal:queue', '[]')",
              });
            }
            return values.map((value) => callback(value));
          } catch (err) {
            return console.log(err, values);
          }
        });
      }, 100);
    });
    return this.iabWindow.addEventListener("exit", () => {
      return clearInterval(this.iabInterval);
    });
  }

  replyInAppBrowserWindow(data) {
    const escapedData = data.replace(/'/g, "'");
    return this.iabWindow.executeScript({
      code: `\
if(window._browserCommsOnMessage) \
window._browserCommsOnMessage('${escapedData}')\
`,
    });
  }

  onMessageInAppBrowserWindow(data) {
    return this.onMessage({
      data,
      source: {
        postMessage: (data) => {
          // needs to be defined in native
          return this.call("browser.reply", { data });
        },
      },
    });
  }

  // Binds global message listener
  // Must be called before .call()
  listen() {
    this.isListening = true;
    selfWindow?.addEventListener("message", this.onMessage);

    // set via win.executeScript in cordova
    (typeof document !== "undefined" && window !== null) &&
      (window._browserCommsOnMessage = (eStr) => {
        return this.onMessage({
          debug: true,
          data: (() => {
            try {
              return JSON.parse(eStr);
            } catch (error) {
              console.log("error parsing", eStr);
              return null;
            }
          })(),
        });
      });

    this.clientValidation = this.client.call("ping", null, {
      timeout: this.handshakeTimeout,
    })
      .then((registeredMethods) => {
        if (this.hasParent) {
          this.parentsRegisteredMethods = this.parentsRegisteredMethods.concat(
            registeredMethods,
          );
        }
      }).catch(() => null);

    this.swValidation = this.ready.then(() => {
      return this.sw?.call("ping", null, { timeout: this.handshakeTimeout });
    })
      .then((registeredMethods) => {
        this.parentsRegisteredMethods = this.parentsRegisteredMethods.concat(
          registeredMethods,
        );
      });
  }

  close() {
    this.isListening = true;
    return selfWindow?.removeEventListener("message", this.onMessage);
  }

  /*
  @param {String} method
  @param {...*} params
  @returns Promise
  */
  async call(method, ...params) {
    if (!this.isListening) {
      return new Promise((resolve, reject) =>
        reject(new Error("Must call listen() before call()"))
      );
    }

    const localMethod = (method, params) => {
      const fn = this.registeredMethods[method];
      if (!fn) {
        throw new Error("Method not found");
      }
      return fn.apply(null, params);
    };

    await this.ready;

    if (this.hasParent) {
      let parentError = null;
      await this.clientValidation;
      const hasParentMethod =
        this.parentsRegisteredMethods.indexOf(method) !== -1;
      if (!hasParentMethod) {
        return localMethod(method, params);
      } else {
        const result = await this.client.call(method, params);
        try {
          // need to send back methods for all parent frames
          if (method === "ping") {
            const localResult = localMethod(method, params);
            return (result || []).concat(localResult);
          } else {
            return result;
          }
        } catch (err) {
          try {
            parentError = err;
            if (this.sw) {
              try {
                const result = await this.sw.call(method, params);
                // need to send back methods for all parent frames
                if (method === "ping") {
                  const localResult = localMethod(method, params);
                  return (result || []).concat(localResult);
                } else {
                  return result;
                }
              } catch {
                return localMethod(method, params);
              }
            } else {
              return localMethod(method, params);
            }
          } catch (err) {
            if (err.message === "Method not found" && parentError) {
              throw parentError;
            } else {
              throw err;
            }
          }
        }
      }
    } else {
      if (this.sw) {
        await this.swValidation;
        if (this.parentsRegisteredMethods.indexOf(method) === -1) {
          return localMethod(method, params);
        } else {
          try {
            const result = await this.sw.call(method, params);
            // need to send back methods for all parent frames
            if (method === "ping") {
              const localResult = localMethod(method, params);
              return (result || []).concat(localResult);
            } else {
              return result;
            }
          } catch (err) {
            return localMethod(method, params);
          }
        }
      } else {
        return localMethod(method, params);
      }
    }
  }

  async onRequest(reply, request, e) {
    // replace callback params with proxy functions
    const params = [];
    for (const param of Array.from(request.params || [])) {
      if (isRPCCallback(param)) {
        ((param) =>
          params.push((...args) =>
            reply(createRPCCallbackResponse({
              params: args,
              callbackId: param.callbackId,
            }))
          ))(param);
      } else {
        params.push(param);
      }
    }

    // acknowledge request, prevent request timeout
    reply(createRPCRequestAcknowledgement({ requestId: request.id }));

    try {
      const result = await this.call(request.method, ...Array.from(params), {
        e,
      });
      return reply(createRPCResponse({
        requestId: request.id,
        result,
      }));
    } catch (err) {
      return reply(createRPCResponse({
        requestId: request.id,
        rPCError: createRPCError({
          code: ERROR_CODES.DEFAULT,
          data: err,
        }),
      }));
    }
  }

  onMessage(e, { isServiceWorker } = {}) {
    try { // silent
      const message = typeof e.data === "string" ? JSON.parse(e.data) : e.data;

      if (!isRPCEntity(message)) {
        return; // non-browsercomms message
      }

      const reply = function (message) {
        if (typeof document !== "undefined" && window !== null) {
          return e.source?.postMessage(JSON.stringify(message), "*");
        } else {
          return e.ports[0].postMessage(JSON.stringify(message));
        }
      };

      if (isRPCRequest(message)) {
        return this.onRequest(reply, message, e);
      } else if (isRPCEntity(message)) {
        let rpc;
        if (this.isParentValidFn(e.origin)) {
          rpc = isServiceWorker ? this.sw : this.client;
          return rpc.resolve(message);
        } else if (isRPCResponse(message)) {
          rpc = isServiceWorker ? this.sw : this.client;
          return rpc.resolve(createRPCResponse({
            requestId: message.id,
            rPCError: createRPCError({
              code: ERROR_CODES.INVALID_ORIGIN,
            }),
          }));
        } else {
          throw new Error("Invalid origin");
        }
      } else {
        throw new Error("Unknown RPCEntity type");
      }
    } catch (err) {
    }
  }

  /*
  * Register method to be called on child request, or local request fallback
  @param {String} method
  @param {Function} fn
  */
  on(method, fn) {
    this.registeredMethods[method] = fn;
  }
}

export default BrowserComms;

function waitForServiceWorker() {
  return new Promise((resolve, reject) => {
    const readyTimeout = setTimeout(resolve, SW_CONNECT_TIMEOUT_MS);

    return navigator?.serviceWorker?.ready
      .catch(function () {
        console.log("caught sw error");
        return null;
      }).then((registration) => {
        const worker = registration?.active;
        if (worker) {
          this.sw = new RPCClient({
            timeout: this.timeout,
            postMessage: (msg, origin) => {
              const swMessageChannel = new MessageChannel();
              if (swMessageChannel) {
                swMessageChannel.port1.onmessage = (e) => {
                  return this.onMessage(e, { isServiceWorker: true });
                };
                return worker.postMessage(
                  msg,
                  [swMessageChannel.port2],
                );
              }
            },
          });
        }
        clearTimeout(readyTimeout);
        return resolve();
      });
  });
}
