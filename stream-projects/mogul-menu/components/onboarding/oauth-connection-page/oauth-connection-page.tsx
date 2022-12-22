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
import { isGoogleChrome } from "../../../shared/mod.ts";
import { isNative } from "../../../shared/mod.ts";
import { Page, usePageStack } from "../../page-stack/mod.ts";
import ChatSettingsPage from "../chat-settings-page/chat-settings-page.tsx";
import NotificationTopicPage from "../notification-topic-page/notification-topic-page.tsx";
import NotificationsEnablePage from "../notifications-enable-page/notifications-enable-page.tsx";
import LocalOAuthFrame from "./local-oauth-frame.tsx";

import stylesheet from "./oauth-connection-page.scss.js";

export default function OAuthConnectionPage(
  { sourceType = "youtube" }: { sourceType: ConnectionSourceType },
) {
  useStyleSheet(stylesheet);

  const imgProps = isNative()
    ? {
      height: 221,
      isStretch: true,
      isCentered: true,
      aspectRatio: 390 / 221,
    }
    : {
      widthPx: 576,
      height: 300,
    };
  return (
    <Page isFullSize shouldDisableEscape shouldShowHeader={false}>
      <div className="c-oauth-connection-page">
        <div className="onboard-image">
          <ImageByAspectRatio
            imageUrl="https://cdn.bio/assets/images/features/browser_extension/extension-onboarding.png"
            {...imgProps}
          />
        </div>
        <div className="info">
          <div className="title">
            Let's get started
          </div>
          Connect your Youtube account to start earning channel points, unlocking rewards, and
          participating in polls and predictions through Truffle
        </div>
        <OAuthButton sourceType={sourceType} />
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
  const { clearPageStack, pushPage, popPage } = usePageStack();

  const onLoggedIn = () => {
    popPage();
    pushPage(
      <ChatSettingsPage
        onContinue={() => {
          // notifications only supported in Google Chrome atm
          if (isGoogleChrome) {
            pushPage(
              <NotificationsEnablePage
                onContinue={(shouldSetupNotifications) => {
                  if (shouldSetupNotifications) {
                    pushPage(<NotificationTopicPage onContinue={clearPageStack} />);
                  } else {
                    clearPageStack();
                  }
                }}
              />,
            );
          } else {
            clearPageStack();
          }
        }}
      />,
    );
  };

  // for native app, eventually desktop if we setup jumper for window.open messages
  const { unsubscribe } = onAccessTokenChange(() => {
    unsubscribe();
    onLoggedIn();
  });

  // listens for a post message from the OAuthIframe component
  // and call onLoggedIn when a user logs in using a 3rd party connection
  // and the user's truffle access token is returned.
  // only necessary because jumper doesn't work with window.open atm
  useHandleTruffleOAuth((oauthResponse: OAuthResponse) => {
    unsubscribe();
    setAccessToken(oauthResponse.truffleAccessToken);
    onLoggedIn();
  });
  const context = globalContext.getStore();
  const orgId = context?.orgId;
  const accessToken = useSelector(() => accessToken$.get());

  return (
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
    // For local development
    // <LocalOAuthFrame sourceType={sourceType} accessToken={accessToken} orgId={orgId} />
  );
}
