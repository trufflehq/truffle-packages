import {
  useMemo,
  useQuery,
  useSignal,
  useUpdateSignalOnChange,
  useUrqlQuerySignal,
} from "../../../deps.ts";
import { OrgUserConnections } from "../../../types/mod.ts";
import { ORG_USER_CONNECTIONS_QUERY, USER_INFO_QUERY } from "./gql.ts";

export function useUserInfo() {
  const [{ data: userInfoData }, reexecuteUserInfoQuery] = useQuery({
    query: USER_INFO_QUERY,
    requestPolicy: "network-only",
    context: useMemo(
      () => ({
        additionalTypenames: [
          "OwnedCollectible",
          "CollectibleConnection",
          "Collectible",
          "ActivePowerup",
          "OrgUserCounterType",
          "OrgUserCounter",
        ],
      }),
      [],
    ),
  });

  return { userInfoData, reexecuteUserInfoQuery };
}

export function useOrgUserConnectionsQuery() {
  const orgUser$ = useSignal<{ orgUser: OrgUserConnections }>(undefined!);

  const { signal$: orgUserData$, reexecuteQuery: refetchOrgUserConnections } =
    useUrqlQuerySignal(
      ORG_USER_CONNECTIONS_QUERY,
    );
  useUpdateSignalOnChange(orgUser$, orgUserData$.data);

  return {
    orgUser$,
    orgUserData$,
    refetchOrgUserConnections,
  };
}
