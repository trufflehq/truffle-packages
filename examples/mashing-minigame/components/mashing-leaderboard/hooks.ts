import { MASHING_LEADERBOARD_QUERY } from "../../api/gql.ts";
import { usePollingQuery } from "https://tfl.dev/@truffle/api@~0.1.1/client.ts";

type OrgUserCounterType = {
  userId: string
  count: number
}

type OrgUserCounterTypeConnection = {
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
  return orgUserCounterTypeConnection as OrgUserCounterTypeConnection
}
