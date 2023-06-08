import {
  ConnectionSourceType,
  getAccessToken$,
  globalContext,
  ImageByAspectRatio,
  jumper,
  OAuthIframe,
  OAuthResponse,
  onAccessTokenChange,
  React,
  setAccessToken,
  useHandleTruffleOAuth,
  useSelector,
  useStyleSheet,
} from "../../../deps.ts";
import { Page } from "../../page-stack/mod.ts";
import { MeUserWithConnectionConnection } from "../../../types/mod.ts";
import { useOnLoggedIn } from "../mod.ts";
import LocalOAuthFrame from "./local-oauth-frame.tsx";

import stylesheet from "./oauth-connection-page.scss.js";
import { getOrgId } from "../../../shared/util/truffle/org-id.ts";

export default function OAuthConnectionPage(
  { sourceType = "youtube" }: { sourceType: ConnectionSourceType },
) {
  useStyleSheet(stylesheet);

  return (
    <Page
      isFullSize
      shouldDisableEscape
      shouldShowHeader={false}
      isAnimated={false}
    >
      <div className="c-oauth-connection-page">
        <div className="onboard-image" />
        <div className="title">
          Let's get started
        </div>
        <div className="description">
          Connect your Youtube account to start earning channel points,
          unlocking rewards, and participating in polls and predictions through
          Truffle
        </div>
        <div className="button">
          <OAuthButton sourceType={sourceType} />
          <div className="loading">Loading...</div>
        </div>
        <a
          className="policies mm-text-link"
          target={"_blank"}
          href={"https://truffle.vip/policies"}
          rel="noreferrer"
          onClick={(e) => {
            e.preventDefault();
            jumper.call("browser.openWindow", {
              url: e.target.href,
              target: "_blank",
            });
          }}
        >
          Privacy Policies
        </a>
      </div>
    </Page>
  );
}

function OAuthButton(
  { sourceType = "youtube" }: {
    sourceType: ConnectionSourceType;
  },
) {
  const accessToken$ = getAccessToken$();
  const onLoggedIn = useOnLoggedIn();

  // for native app, eventually desktop if we setup jumper for window.open messages
  const { unsubscribe } = onAccessTokenChange(() => {
    unsubscribe();
    onLoggedIn();
  });

  // listens for a post message from the OAuthIframe component
  // and call onLoggedIn when a user logs in using a 3rd party connection
  // and the user's truffle access token is returned.
  // only necessary because jumper doesn't work with window.open atm
  useHandleTruffleOAuth(async (oauthResponse: OAuthResponse) => {
    unsubscribe();
    await setAccessToken(oauthResponse.truffleAccessToken);
    onLoggedIn();
  });
  const context = globalContext.getStore();
  const orgId = getOrgId();
  const accessToken = useSelector(() => accessToken$.get());

  return (
    <OAuthIframe
      sourceType={sourceType}
      accessToken={accessToken}
      orgId={orgId}
      styles={{
        width: "308px",
        height: "42px",
        border: "none",
      }}
    />
    // For local development
    // <LocalOAuthFrame sourceType={sourceType} accessToken={accessToken} orgId={orgId} />
  );
}

function hasConnectionAnyOrg(
  me: MeUserWithConnectionConnection,
  sourceType: ConnectionSourceType,
) {
  return sourceType &&
    me.connectionConnection?.nodes?.find((connection) =>
      connection.sourceType === sourceType
    );
}
