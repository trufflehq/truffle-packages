import { TruffleGQlConnection } from "../deps.ts";
export interface PollOption {
  index: number;
  text: string;
  count: number;
  unique: number;
}

export interface PollCounter {
  options: PollOption[];
}

export interface PollVote {
  pollId: string;
  userId: string;
  optionIndex?: number;
  count?: number;
}

export interface Poll {
  __typename: "Poll";
  id: string;
  question: string;
  counter: PollCounter;
  data: {
    type?: "prediction";
    winningOptionIndex?: number;
    winnerSelectedTime?: Date;
    isRefund?: boolean;
  };
  time: Date;
  endTime: Date;
  myVote?: PollVote;
}

export type PollConnection = TruffleGQlConnection<Poll>;
