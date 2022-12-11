import { GLOBAL_JUMPER_MESSAGES, jumper, useEffect } from "../../../deps.ts";
import {
  useActivePowerupConnection,
  useOrgUserConnectionsQuery,
  useOwnedCollectibleConnection,
  useSeasonPassData,
  useUserInfo,
} from "../mod.ts";

/**
 * Listens for invalidate messages from jumper and invalidates all of the extension user's urql queries
 */
export function useInvalidateAllQueriesListener() {
  const { reexecuteUserInfoQuery } = useUserInfo();
  const { reexecuteActivePowerupConnQuery } = useActivePowerupConnection();
  const { reexecuteOwnedCollectibleConnQuery } = useOwnedCollectibleConnection();
  const { refetchOrgUserConnections } = useOrgUserConnectionsQuery();
  const { reexecuteSeasonPassQuery } = useSeasonPassData();

  useEffect(() => {
    jumper.call("comms.onMessage", (message: string) => {
      if (message === GLOBAL_JUMPER_MESSAGES.INVALIDATE_USER) {
        reexecuteUserInfoQuery({ requestPolicy: "network-only" });
        reexecuteActivePowerupConnQuery({ requestPolicy: "network-only" });
        reexecuteOwnedCollectibleConnQuery({ requestPolicy: "network-only" });
        reexecuteSeasonPassQuery({ requestPolicy: "network-only" });
        refetchOrgUserConnections({ requestPolicy: "network-only" });
      }
    });
  }, []);
}
