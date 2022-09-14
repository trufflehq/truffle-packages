import { useEffect } from "../../deps.ts";
import { MESSAGES, OAuthResponse } from "../../shared/mod.ts";

/**
 * This hook will listen to a window.opener.postMessage from
 * the OAuth popup the OAuthButton component opens for client-side 3rd-Party OAuth flows.
 *
 * Upon receiving the 'setAccessToken' message, it will forward this message to the parent.
 *
 * This allows us to embed the OAuthButton component inside the OAuthIframe component to encapsulate the user's
 * private 3rd-party connection info.
 */
export function usePostTruffleAccessTokenToParent() {
  useEffect(() => {
    window.onmessage = function (e) {
      try {
        const parsedMessage: OAuthResponse = JSON.parse(e?.data ?? "{}");
        if (
          parsedMessage?.type === MESSAGES.SET_ACCESS_TOKEN &&
          e.source !== window
        ) {
          window.parent.postMessage(e?.data, "*");
        }
      } catch (err) {}
    };
  }, []);
}
