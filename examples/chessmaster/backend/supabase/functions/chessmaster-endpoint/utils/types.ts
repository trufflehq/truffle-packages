export type ChessMoveAdditionalData = {
  move: string;
  gameId: string;
}

export type PollOption = {
  text: string;
  count: number;
  index: number;
}

export type PollOptionInput = {
  text: string;
}

export type Poll = {
  id: string;
  orgId: string;
  question: string;
  endTime: string
  options: PollOption[];
}