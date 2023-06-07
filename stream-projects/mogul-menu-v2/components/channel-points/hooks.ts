import { useMemo, useQuery } from "../../deps.ts";
import { CHANNEL_POINTS_QUERY } from "./gql.ts";

export function useChannelPoints() {
  const [
    {
      data: channelPointsData,
      error: channelPointsError,
      fetching: isFetchingChannelPoints,
    },
    reexecuteChannelPointsQuery,
  ] = useQuery({
    query: CHANNEL_POINTS_QUERY,
    context: useMemo(
      () => ({
        additionalTypenames: [
          "OrgUserCounterType",
          "OrgUserCounter",
        ],
      }),
      [],
    ),
  });
  return {
    channelPointsData,
    channelPointsError,
    isFetchingChannelPoints,
    reexecuteChannelPointsQuery,
  };
}
