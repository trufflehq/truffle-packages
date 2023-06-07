import { TruffleApp } from "https://npm.tfl.dev/@trufflehq/sdk@0.2.3";
import { getAccessToken } from "./access-token.ts";
import { getOrgId } from "./org-id.ts";

console.log("TruffleApp", TruffleApp);
export const truffleApp = new TruffleApp({
  orgId: getOrgId(),
  url: "https://mycelium.truffle.vip/graphql",
  userAccessToken: getAccessToken(),
});
