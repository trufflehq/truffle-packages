import { Submission } from "../types/mod.ts"
export type PollOption = {
  text: string;
  index: number;
  count: number;
  unique: number;
};

type PollVote = {
  optionIndex: number;
  count: number;
};

export type Poll = {
  id: string;
  orgId: string;
  question: string;
  options: PollOption[];
  myVote: PollVote;
  time: Date;
  endTime: Date;
  data: { submission: Submission };
};

export type PollResponse = {
  poll: Poll;
};

export type PollConnectionResponse = {
  pollConnection: {
    nodes: Poll[];
  };
};

export type PollResponseData = PollResponse | PollConnectionResponse;
