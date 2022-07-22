import { truffleFetch } from "../api/truffle/fetch.ts";
import { Poll, PollOptionInput } from "./types.ts";

export async function getCurrentPoll(orgId?: string): Promise<Poll> {
  const query = `
    query GetCurrentPoll {
      pollConnection(first: 1) {
        nodes {
          id
          orgId
          endTime
          options {
            index
            text
            count
          }
        }
      }
    }
  `;
  const poll = await truffleFetch(query, {}, orgId)
    .then((resp) => resp.json())
    .then((body) => body?.data?.pollConnection?.nodes?.[0]);

  return poll;
}

export function updatePoll(
  pollId: string,
  options: PollOptionInput[],
  orgId?: string
) {
  const query = `
    mutation UpdateMovePoll($input: PollUpsertInput!) {
      pollUpsert(input: $input) {
        poll {
          id
        }
      }
    }
  `;

  const variables = {
    input: {
      id: pollId,
      options,
    },
  };

  return truffleFetch(query, variables, orgId);
}

export function createPoll(orgId: string) {
  const query = `
  mutation UpdateMovePoll($input: PollUpsertInput!) {
    pollUpsert(input: $input) {
      poll {
        id
      }
    }
  }
`;

  const variables = {
    input: {
      question: "What's the next move?",
      durationSeconds: 60,
      options: []
    },
  };

  return truffleFetch(query, variables, orgId);
}
