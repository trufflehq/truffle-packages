import { MESSAGES } from "./messaging.ts";

export function postTruffleAccessTokenToNative(truffleAccessToken?: string) {
  const payload = {
    type: MESSAGES.SET_ACCESS_TOKEN,
    truffleAccessToken,
  };

  // check if the oauth flow is being loaded in the ReactNative webview
  window?.ReactNativeWebView?.postMessage(JSON.stringify(payload));
}
