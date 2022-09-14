import { subscriptionExchange } from "https://npm.tfl.dev/urql@2";
import { createClient as createWSClient } from "https://npm.tfl.dev/graphql-ws@5";
import config from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";

const wsClient = createWSClient({
  // FIXME: .replace is hacky
  url: `${config.API_URL.replace("http", "ws")}/graphql`,
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
