import { createClient, defaultExchanges } from "https://npm.tfl.dev/urql@2";
import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";
import config from "https://tfl.dev/@truffle/utils@0.0.1/config/config.js";

import { getAuthExchange } from "./auth-exchange.js";

export function getClient() {
  const context = globalContext.getStore();

  context.graphqlClient = context.graphqlClient || makeClient();

  return context.graphqlClient;
}

export function makeClient() {
  return createClient({
    url: `${config.API_URL}/graphql`,
    exchanges: [
      getAuthExchange(),
      ...defaultExchanges,
    ],
  });
}
