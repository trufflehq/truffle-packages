import { POLL_CONNECTION_QUERY, POLL_QUERY } from "../gql/mod.ts";
import { PollResponseData, PollConnectionResponse } from '../types/mod.ts'
import { usePollingQuery } from "https://tfl.dev/@truffle/api@~0.1.1/client.ts";
import config from '../config.ts'

function getPoll(pollData: PollResponseData) {
  if(pollData) {
    if('poll' in pollData) {
      return pollData?.poll
    } 
  
    if('pollConnection' in pollData) {
      return pollData.pollConnection?.nodes?.[0]
    }
  }
}

export function useFetchPoll({ pollId, interval = 1000 }: { pollId?: string, interval?: number }) {
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
      query: POLL_CONNECTION_QUERY,
      variables: {
        input: {
          packageId: config.PACKAGE_ID,
        },
        first: 1,
      },
    };
  const result = usePollingQuery(interval, queryInput);
  const pollData: PollResponseData = result?.data;

  const latestPoll = getPoll(pollData)

  return latestPoll;
}

export function useFetchPollHistory(first = 50) {
  const queryInput = {
      query: POLL_CONNECTION_QUERY,
      variables: {
        input: {
          packageId: config.PACKAGE_ID,
        },
        first,
      },
    };
  const result = usePollingQuery(1000, queryInput);
  const pollData: PollConnectionResponse = result?.data;

  return pollData?.pollConnection?.nodes
}

