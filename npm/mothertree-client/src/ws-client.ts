import { createClient } from 'graphql-ws';
import { DEFAULT_MOTHERTREE_API_URL } from './constants';
import ws from 'ws';

export interface WSClientOptions {
  url?: string;
  accessToken?: string;
}

export function createWSClient(options?: WSClientOptions) {
  const WebSocketImpl =
    typeof globalThis.WebSocket !== 'undefined' ? WebSocket : ws;
  class CustomWebSocketImpl extends WebSocketImpl {
    constructor(url: string, protocols: string | string[] | undefined) {
      const wsOptions: any = {};

      if (options?.accessToken != null) {
        wsOptions.headers = {
          'x-access-token': options.accessToken,
        };
      }

      super(url, protocols, wsOptions);
    }
  }

  let activeSocket: WebSocket;
  let timeoutId: any; //NodeJS.Timeout;

  return createClient({
    url: options?.url ?? DEFAULT_MOTHERTREE_API_URL,

    // if in a browser, use the native WebSocket; otherwise, use the ws lib
    webSocketImpl: CustomWebSocketImpl,

    // basically want to retry until we're connected
    retryAttempts: 99999,
    retryWait: async (retries) => {
      // 0.5s, 1s, 1.5, 2s, ..., 5s (repeated)
      const delayMs = Math.min((retries + 1) * 400, 5000);
      console.log(`Retrying websocket connection in ${delayMs}ms`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    },
    // always retry. otherwise it doesn't seem to retry if server is down
    shouldRetry: (/* errOrCloseEvent */) => true,
    keepAlive: 15000,
    on: {
      connected: (socket) => (activeSocket = socket as WebSocket),
      ping: (received) => {
        if (!received)
          // sent
          timeoutId = setTimeout(() => {
            console.log('Closing socket due to ping timeout');
            if (activeSocket.readyState === WebSocket.OPEN)
              activeSocket.close(4408, 'Request Timeout');
          }, 5000); // wait 5 seconds for the pong and then close the connection
      },
      pong: (received) => {
        if (received) clearTimeout(timeoutId); // pong is received, clear connection close timeout
      },
    },
  });
}
