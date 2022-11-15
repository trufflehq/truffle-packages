import { MESSAGES } from "./messaging.ts";

export function closeSelf() {
  const self = window.self;
  self.opener = window.self;
  self.close();
}

export function postTruffleAccessTokenToOpener(truffleAccessToken?: string) {
  const payload = {
    type: MESSAGES.SET_ACCESS_TOKEN,
    truffleAccessToken,
  };

  // check if the oauth flow is being loaded in the ReactNative webview
  if (window?.opener) {
    window.opener?.postMessage(JSON.stringify(payload), "*");
  }
}
