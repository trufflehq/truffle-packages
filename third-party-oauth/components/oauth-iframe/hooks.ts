import { useEffect } from "../../deps.ts";
import { MESSAGES, OAuthResponse } from "../../shared/mod.ts";

export function useHandleTruffleOAuth(
  onSetAccessToken: (oauthResponse: OAuthResponse) => void,
) {
  useEffect(() => {
    window.onmessage = function (e) {
      try {
        const parsedMessage: OAuthResponse = JSON.parse(e.data ?? "{}");
        if (parsedMessage?.type === MESSAGES.SET_ACCESS_TOKEN) {
          if (parsedMessage?.truffleAccessToken) {
            console.log(
              "connection accessToken",
              parsedMessage.truffleAccessToken,
            );
            onSetAccessToken(parsedMessage);
          }
        }
      } catch (err) {}
    };
  }, [onSetAccessToken]);
}
