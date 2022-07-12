import { createClient, defaultExchanges } from "https://npm.tfl.dev/urql@2";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.js";

import { getAuthExchange } from "./auth-exchange.js";

export function getClient() {
  const context = globalContext.getStore();

  context._graphqlClient = context._graphqlClient || makeClient();

  return context._graphqlClient;
}

export function makeClient() {
  const context = globalContext.getStore();

  return createClient({
    url: `${context.config.API_URL}/graphql`,
    exchanges: [
      getAuthExchange(),
      ...defaultExchanges,
    ],
  });
}
