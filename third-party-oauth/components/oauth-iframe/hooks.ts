import { useEffect } from "../../deps.ts";
import { OAuthResponse } from "../../shared/mod.ts";

export function useHandleTruffleOAuth(onSetAccessToken: (oauthResponse: OAuthResponse) => void) {
  useEffect(() => {
    window.onmessage = function (e) {
      try {
        const parsedMessage: OAuthResponse = JSON.parse(e.data ?? "{}");
        if (parsedMessage?.type === "setAccessToken") {
          if (parsedMessage?.truffleAccessToken) {
            console.log("connection accessToken", parsedMessage.truffleAccessToken);
            onSetAccessToken(parsedMessage);
          }
        }
      } catch (err) {}
    };
  }, [onSetAccessToken]);
}
