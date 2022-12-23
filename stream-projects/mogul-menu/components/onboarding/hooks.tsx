import { getConnectionSourceType, React, useExtensionInfo$, useObserve } from "../../deps.ts";
import { hasConnection, useOrgUserConnectionsQuery } from "../../shared/mod.ts";
import { usePageStack } from "../page-stack/mod.ts";
import { BasePage, OAuthConnectionPage } from "./mod.ts";

/**
 * Checks if the logged in user has the appropriate connection for the source the embed is
 * being injected into (YouTube or Twitch) and starts the onboarding process if the connection
 * doesn't exist.
 */
export function useOnboarding() {
  const { orgUser$ } = useOrgUserConnectionsQuery();
  const { pushPage } = usePageStack();
  const extensionInfo$ = useExtensionInfo$();

  useObserve(() => {
    const extensionInfo = extensionInfo$.get();
    const connectionSourceType = extensionInfo?.pageInfo
      ? getConnectionSourceType(extensionInfo.pageInfo)
      : "youtube";

    const orgUser = orgUser$.orgUser.get();

    // HACK: on staging we want to be able to login w/o having to use oauth
    const isNonProd = window?._truffleInitialData?.clientConfig?.IS_STAGING_ENV ||
      window?._truffleInitialData?.clientConfig?.IS_DEV_ENV;
    const isOAuthDesired = isNonProd ? extensionInfo?.pageInfo : true;

    if (
      isOAuthDesired && orgUser && !hasConnection(orgUser, connectionSourceType)
    ) {
      pushPage(<BasePage />);
      pushPage(<OAuthConnectionPage sourceType={connectionSourceType} />);
    }
  });
}
