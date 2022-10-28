import { subscriptionExchange } from "https://npm.tfl.dev/urql@2";
import { createClient as createWSClient } from "https://npm.tfl.dev/graphql-ws@5";
import config from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";
import isSsr from "https://tfl.dev/@truffle/utils@~0.0.22/ssr/is-ssr.ts";

const wsClient = !isSsr && createWSClient({
  // FIXME: .replace is hacky
  url: `${config.API_URL.replace("http", "ws")}/graphql`,
  // TODO: pass in websocket lib on node for ssr
  // need to figure out smart way to import only for node - ideally normal import, not dynamic
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
