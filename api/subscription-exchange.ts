import { subscriptionExchange } from "https://npm.tfl.dev/urql@2";
import { createClient as createWSClient } from "https://npm.tfl.dev/graphql-ws@5";

const wsClient = createWSClient({
  url: "ws://localhost:50330/graphql",
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
