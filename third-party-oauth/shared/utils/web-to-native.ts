import { MESSAGES } from "./messaging.ts";
import { jumper, setAccessToken } from "../../deps.ts";

export function postTruffleAccessTokenToNative(
  truffleAccessToken?: string,
  orgId?: string,
) {
  setAccessToken(truffleAccessToken, { orgId });
  jumper.call("browser.closeWindow");

  // FIXME: legacy, rm after 12/15/2022
  const payload = {
    type: MESSAGES.SET_ACCESS_TOKEN,
    truffleAccessToken,
  };
  // check if the oauth flow is being loaded in the ReactNative webview
  window?.ReactNativeWebView?.postMessage(JSON.stringify(payload));
  // end legacy
}
