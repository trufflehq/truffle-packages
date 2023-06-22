import { initTruffleApp } from "https://npm.tfl.dev/@trufflehq/sdk@0.2.7";
import {
  observable,
  opaqueObject,
} from "https://npm.tfl.dev/@legendapp/state@1.2.8";
import { getOrgId } from "./org-id.ts";
import { getAccessToken } from "./access-token.ts";

function initApp() {
  return initTruffleApp({
    // url: "https://mycelium.truffle.vip/graphql",
    orgId: getOrgId(),
    userAccessToken: getAccessToken(),
  });
}

export const truffleApp$ = observable(opaqueObject(initApp()));

export function reInitTruffleApp() {
  truffleApp$.set(opaqueObject(initApp()));
}
