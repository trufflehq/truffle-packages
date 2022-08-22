import { SubmissionRecord } from './submission.types.ts'

export type PollUserInputOption = {
  text: string;
  index: number;
};

export type PollData = {
  submission: SubmissionRecord
}

export type ViewerCreatePollUserInput = {
  question: string;
  options: PollUserInputOption[];
};

export type PollUpsertPayload = {
  data: {
    pollUpsert: {
      poll: {
        id: string;
        question: string;
        options: PollUserInputOption[];
      };
    };
  };
};