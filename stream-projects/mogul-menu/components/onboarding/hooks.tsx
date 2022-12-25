import {
  ConnectionSourceType,
  getConnectionSourceType,
  gql,
  React,
  useComputed,
  useExtensionInfo$,
  useObserve,
  useQuerySignal,
} from "../../deps.ts";
import { getOrgId } from "https://tfl.dev/@truffle/utils@~0.0.3/site/site.ts";
import { MeUserWithConnectionConnection } from "../../types/mod.ts";
import { usePageStack } from "../page-stack/mod.ts";
import { isGoogleChrome } from "../../shared/mod.ts";
import { BasePage, ContinueAsPage, OAuthConnectionPage } from "./mod.ts";
import ChatSettingsPage from "./chat-settings-page/chat-settings-page.tsx";
import NotificationTopicPage from "./notification-topic-page/notification-topic-page.tsx";
import NotificationsEnablePage from "./notifications-enable-page/notifications-enable-page.tsx";

/**
 * Checks if the logged in user has the appropriate connection for the source the embed is
 * being injected into (YouTube or Twitch) and starts the onboarding process if the connection
 * doesn't exist.
 * TODO: this may make more sense to have as normal component vs a hook
 */

const USER_CONNECTION_CONNECTION_QUERY = gql`
  query { me { name, connectionConnection { nodes { orgId, sourceType, sourceId } } } }
`;

export function useOnboarding() {
  const { pushPage } = usePageStack();
  const extensionInfo$ = useExtensionInfo$();

  const meWithConnectionConnectionResponse$ = useQuerySignal(
    USER_CONNECTION_CONNECTION_QUERY,
  );
  const meWithConnectionConnection$ = useComputed<
    MeUserWithConnectionConnection
  >(() => meWithConnectionConnectionResponse$.me);

  useObserve(() => {
    const extensionInfo = extensionInfo$.get();
    const meWithConnectionConnection = meWithConnectionConnection$.get();
    const connectionSourceType = extensionInfo?.pageInfo
      ? getConnectionSourceType(extensionInfo.pageInfo)
      : "youtube";

    // HACK: on staging we want to be able to login w/o having to use oauth
    const isNonProd =
      window?._truffleInitialData?.clientConfig?.IS_STAGING_ENV ||
      window?._truffleInitialData?.clientConfig?.IS_DEV_ENV;
    const isOAuthDesired = isNonProd ? extensionInfo?.pageInfo : true;

    const hasConnectionForThisOrg = hasConnectionByOrgId(
      getOrgId(),
      meWithConnectionConnection,
      connectionSourceType,
    );
    const hasConnectionForAnyOrg = hasConnectionByAnyOrg(
      meWithConnectionConnection,
      connectionSourceType,
    );

    const shouldShowContinueAsPage = meWithConnectionConnection &&
      !hasConnectionForThisOrg &&
      hasConnectionForAnyOrg;
    const shouldShowOAuthPage = meWithConnectionConnection &&
      isOAuthDesired &&
      !hasConnectionForThisOrg;

    if (shouldShowContinueAsPage) {
      pushPage(<BasePage />);
      pushPage(
        <ContinueAsPage
          meWithConnectionConnection={meWithConnectionConnection}
        />,
      );
    } else if (shouldShowOAuthPage) {
      pushPage(<BasePage />);
      pushPage(
        <OAuthConnectionPage sourceType={connectionSourceType} />,
      );
    }
  });
}

export function useOnLoggedIn() {
  const { clearPageStack, pushPage, popPage } = usePageStack();

  return () => {
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
                    pushPage(
                      <NotificationTopicPage onContinue={clearPageStack} />,
                    );
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
}

function hasConnectionByOrgId(
  orgId: string,
  me: MeUserWithConnectionConnection,
  sourceType: ConnectionSourceType,
): boolean {
  return Boolean(
    sourceType && me &&
      me.connectionConnection?.nodes?.find((connection) =>
        connection.sourceType === sourceType && connection.orgId === orgId
      ),
  );
}

function hasConnectionByAnyOrg(
  me: MeUserWithConnectionConnection,
  sourceType: ConnectionSourceType,
): boolean {
  return Boolean(
    sourceType && me &&
      me.connectionConnection?.nodes?.find((connection) =>
        connection.sourceType === sourceType
      ),
  );
}