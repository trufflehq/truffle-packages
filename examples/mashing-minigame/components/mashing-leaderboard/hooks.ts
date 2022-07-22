import { useMemo } from "https://npm.tfl.dev/react";
import { MASHING_LEADERBOARD_QUERY } from "../../api/gql.ts";
import { usePollingQuery } from "https://tfl.dev/@truffle/api@~0.1.1/client.ts";

export type User = {
  name?: string
}
export type OrgUserCounterType = {
  userId: string
  count: number
  user: User
}

export type OrgUserCounterTypeConnection = {
  nodes: OrgUserCounterType[]
}

export function useIntervalFetchMashingLeaderboard(orgUserCounterTypeId: string) {

  const queryInput = {
      query: MASHING_LEADERBOARD_QUERY,
      variables: {
        input: {
          id: orgUserCounterTypeId
        },
      },
    };
  const result = usePollingQuery(1000, queryInput);
  const orgUserCounterTypeConnection = result?.data?.orgUserCounterType?.orgUserCounterConnection;

  const memoizedOrgUserCounterTypeConnection = useMemo(() => {

    const connection = orgUserCounterTypeConnection

    return connection
  }, [JSON.stringify(orgUserCounterTypeConnection)])

  return memoizedOrgUserCounterTypeConnection as OrgUserCounterTypeConnection
}
