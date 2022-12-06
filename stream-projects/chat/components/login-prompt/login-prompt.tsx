import {
  ConnectionSourceType,
  globalContext,
  OAuthIframe,
  OAuthResponse,
  OAuthSourceType,
  Observable,
  setAccessToken,
  useHandleTruffleOAuth,
  useSelector,
  useStyleSheet,
} from "../../deps.ts";
import stylesheet from "./login-prompt.scss.js";

const LOCAL_HOSTNAME = "https://local-oauth.rileymiller.dev";

export default function LoginWithYoutubePrompt(
  { isLoginPromptOpen$, accessToken$, sourceType }: {
    isLoginPromptOpen$: Observable<boolean>;
    accessToken$: Observable<string>;
    sourceType: OAuthSourceType;
  },
) {
  useStyleSheet(stylesheet);

  const onSetAccessToken = (oauthResponse: OAuthResponse) => {
    setAccessToken(oauthResponse.truffleAccessToken);
    isLoginPromptOpen$.set(false);
  };
  useHandleTruffleOAuth(onSetAccessToken);
  const accessToken = useSelector(() => accessToken$.get());

  console.log("accessToken", accessToken);
  const context = globalContext.getStore();
  const orgId = context?.orgId;

  return (
    <div className="c-login-prompt">
      <OAuthIframe
        sourceType={sourceType}
        accessToken={accessToken}
        orgId={orgId}
        styles={{
          width: "308px",
          height: "42px",
          margin: "20px auto",
          border: "none",
        }}
      />
      {/* Uncomment for local dev  */}
      {/* <LocalOAuthFrame orgId={orgId} accessToken={accessToken} sourceType={"youtube"} /> */}
    </div>
  );
}

export function LocalOAuthFrame(
  { sourceType, accessToken, orgId }: {
    sourceType: ConnectionSourceType;
    accessToken: string;
    orgId: string;
  },
) {
  return (
    <iframe
      src={`${LOCAL_HOSTNAME}/auth/${sourceType}?accessToken=${accessToken}&orgId=${orgId}`}
      style={{
        width: "290px",
        height: "42px",
        margin: "20px auto 8px auto",
        border: "none",
      }}
    />
  );
}
