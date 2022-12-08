import { MASHING_CONFIG_QUERY, MASHING_RANK_QUERY } from "../../api/gql.ts";
import { usePollingQuery } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

export function useIntervalFetchMashingConfig() {
  const queryInput = {
    query: MASHING_CONFIG_QUERY,
    variables: {
      input: {
        key: "mashingConfig",
      },
    },
  };
  const result = usePollingQuery(1000, queryInput);
  const keyValue = result?.data?.org?.keyValue;

  return JSON.parse(keyValue?.value || "{}");
}

export function useIntervalFetchOrgUserCounter(orgUserCounterTypeId: string) {
  const queryInput = {
    query: MASHING_RANK_QUERY,
    variables: {
      input: {
        id: orgUserCounterTypeId,
      },
    },
  };

  const result = usePollingQuery(1000, queryInput);
  const orgUserCounter = result?.data?.orgUserCounterType?.orgUserCounter;

  return orgUserCounter;
}
