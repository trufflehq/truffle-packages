import { MESSAGES } from "./messaging.ts";
import { jumper } from "../../deps.ts";

export async function postTruffleAccessTokenToNative(
  truffleAccessToken?: string,
) {
  console.log("web to native");

  await jumper.call("user.setAccessToken", {
    accessToken: truffleAccessToken,
  });

  console.log("jumper called");

  // FIXME: legacy, rm after 12/15/2022
  const payload = {
    type: MESSAGES.SET_ACCESS_TOKEN,
    truffleAccessToken,
  };
  // check if the oauth flow is being loaded in the ReactNative webview
  window?.ReactNativeWebView?.postMessage(JSON.stringify(payload));
  // end legacy
}
