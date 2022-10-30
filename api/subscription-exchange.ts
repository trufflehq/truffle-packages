import { subscriptionExchange } from "https://npm.tfl.dev/urql@2";
import { createClient as createWSClient } from "https://npm.tfl.dev/graphql-ws@5";
import config from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";
import isSsr from "https://tfl.dev/@truffle/utils@~0.0.22/ssr/is-ssr.ts";

const wsClient = !isSsr && createWSClient({
  // FIXME: .replace is hacky
  url: `${config.API_URL.replace("http", "ws")}/graphql`,
  // TODO: pass in websocket lib on node for ssr
  // need to figure out smart way to import only for node - ideally normal import, not dynamic

  // basically want to retry until we're connected
  retryAttempts: 99999,
  retryWait: async (retries) => {
    // 0.5s, 1s, 1.5, 2s, ..., 5s (repeated)
    const delayMs = Math.min((retries + 1) * 400, 5000);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  },
  // always retry. otherwise it doesn't seem to retry if server is down
  shouldRetry: (/* errOrCloseEvent */) => true,
});

export function getSubscriptionExchange() {
  return subscriptionExchange({
    forwardSubscription(operation) {
      return {
        subscribe: (sink) => {
          const dispose = wsClient.subscribe(operation, sink);
          return {
            unsubscribe: dispose,
          };
        },
      };
    },
  });
}
