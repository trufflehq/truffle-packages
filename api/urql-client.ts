import {
  Client,
  createClient,
  defaultExchanges,
  Exchange,
} from "https://npm.tfl.dev/urql@2";

import {
  getPackageContext,
  setPackageContext,
} from "https://tfl.dev/@truffle/global-context@^1.0.0/package-context.ts";
import isSsr from "https://tfl.dev/@truffle/utils@~0.0.22/ssr/is-ssr.ts";
import config from "https://tfl.dev/@truffle/config@^1.0.0/index.ts";

import { getAuthExchange } from "./auth-exchange.ts";
import { getSubscriptionExchange } from "./subscription-exchange.ts";

export function getClient() {
  const context = getPackageContext("@truffle/api@0");
  setPackageContext("@truffle/api@0", {
    client: context.client || makeClient(),
  });
  return context.client as Client;
}

export function makeClient() {
  return createClient({
    url: `${config.API_URL}/graphql`,
    exchanges: [
      getAuthExchange(),
      !isSsr && getSubscriptionExchange(),
      ...defaultExchanges,
    ].filter(Boolean) as Exchange[],
  });
}
