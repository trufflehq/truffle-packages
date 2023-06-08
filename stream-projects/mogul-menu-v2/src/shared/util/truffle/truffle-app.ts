import { TruffleApp } from "https://npm.tfl.dev/@trufflehq/sdk@0.2.6";
import { getAccessToken } from "./access-token.ts";
import { getOrgId } from "./org-id.ts";

export const truffleApp = new TruffleApp({
  orgId: getOrgId(),
  url: "https://mycelium.truffle.vip/graphql",
  userAccessToken: getAccessToken(),
});
