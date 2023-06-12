import { initTruffleApp } from "https://npm.tfl.dev/@trufflehq/sdk@0.2.7";
import {
  observable,
  opaqueObject,
} from "https://npm.tfl.dev/@legendapp/state@1.2.8";

function initApp() {
  return initTruffleApp({
    // url: "https://mycelium.truffle.vip/graphql",
  });
}

export const truffleApp$ = observable(opaqueObject(initApp()));

export function reInitTruffleApp() {
  truffleApp$.set(opaqueObject(initApp()));
}
