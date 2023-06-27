import { initTruffleApp } from "https://npm.tfl.dev/@trufflehq/sdk@0.3.2";
import { fromSpecObservable } from "../general.ts";

function initApp() {
  return initTruffleApp();
}

export const truffleApp = initApp();
export const user$ = fromSpecObservable(truffleApp.user.observable);
