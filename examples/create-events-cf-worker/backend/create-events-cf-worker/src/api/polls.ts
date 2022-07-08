import { truffleFetch } from "./fetch";

const VIEWER_POLL_TIME_LIMIT_SECONDS = 60;

export type ViewerCreatePollUserInputOption = {
  text: string;
  index: number;
};

export type PollUpsertPayload = {
  data: {
    pollUpsert: {
      poll: {
        id: string;
        question: string;
        options: ViewerCreatePollUserInputOption[];
      };
    };
  };
};

export async function createPoll(
  question: string,
  options: ViewerCreatePollUserInputOption[],
  orgId?: string,
) {
  const query = `mutation PollUpsert ($input: PollUpsertInput) {
    pollUpsert(input: $input) {
        poll {
            id
            question
            options {
              text
              index
            }
        }
    }
  }`;

  const variables = {
    input: {
      question,
      options,
      durationSeconds: VIEWER_POLL_TIME_LIMIT_SECONDS,
    },
  };

  try {
    const response = await truffleFetch(query, variables, orgId);
    const data: PollUpsertPayload = await response.json();

    return data.data.pollUpsert.poll;
  } catch (err) {
    console.error("error during truffle fetch", err);
  }
}
