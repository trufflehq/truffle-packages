import { PACKAGE_CONNECTION_QUERY, POLL_QUERY } from "./gql.ts";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import { usePollingQuery } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

export function useFetchPoll({ pollId }) {
  const context = globalContext.getStore();
  const queryInput = pollId
    ? {
      query: POLL_QUERY,
      variables: {
        input: {
          id: pollId,
        },
      },
    }
    : {
      query: PACKAGE_CONNECTION_QUERY,
      variables: {
        input: {
          packageId: context?.packageId,
        },
        first: 1,
      },
    };
  const result = usePollingQuery(1000, queryInput);
  const pollData = result?.data;

  const latestPoll = pollId
    ? pollData?.poll
    : pollData?.pollConnection?.nodes?.[0];

  return latestPoll;
}
