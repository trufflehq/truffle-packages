import { _ } from "../../../deps.ts";
import { Poll } from "../../../types/mod.ts";

export function getPollTimeRemaining(pollEndTime: Date | undefined) {
  if (!pollEndTime) return;
  const start = new Date().getTime();
  const end = new Date(pollEndTime).getTime();
  const timeRemaining = (end - start) / 1000;

  return timeRemaining;
}

export function getHasPollEnded(pollEndTime: Date | undefined) {
  const timeRemaining = getPollTimeRemaining(pollEndTime);
  const hasPollEnded = timeRemaining && timeRemaining < 0;

  return hasPollEnded;
}

// get all of the info for a given poll
export function getPollInfo(poll: Poll) {
  const pollQuestion = poll?.question;

  // poll start/stop
  const pollStartTime = poll?.time;
  const pollEndTime = poll?.endTime;
  const hasPollEnded = getHasPollEnded(poll?.endTime);

  // poll votes
  const totalVotes = _.sumBy(poll.counter.options, "count");
  const winningOptionIndex = poll?.data?.winningOptionIndex;
  const winningOption = typeof winningOptionIndex !== "undefined"
    ? poll?.counter.options?.find((option) =>
      option?.index === winningOptionIndex
    )
    : undefined;
  const hasWinningOption = Boolean(winningOption);
  const winningVotes = typeof winningOptionIndex !== "undefined"
    ? poll?.counter.options[winningOptionIndex]?.count
    : 1;
  const isRefund = poll?.data?.isRefund;

  // user vote
  const myVote = poll?.myVote;
  const myVoteOptionIndex = myVote?.optionIndex;
  const hasVoted = myVoteOptionIndex !== undefined;

  // user outcome
  const didWin = winningOption?.index === myVoteOptionIndex;
  const myPlacedVotes = myVote?.count;
  const myWinningShare = didWin && myPlacedVotes
    ? Math.floor((myPlacedVotes / winningVotes) * totalVotes)
    : 0;

  return {
    hasPollEnded,
    winningOption,
    hasWinningOption,
    pollQuestion,
    pollStartTime,
    pollEndTime,
    myVote,
    hasVoted,
    isRefund,
    didWin,
    totalVotes,
    myPlacedVotes,
    myWinningShare,
  };
}

export function isPrediction(
  poll: unknown & { data?: { type?: string } },
): poll is Poll {
  return poll?.data?.type === "prediction";
}

export function getOptionColor(index: number) {
  const colors = [
    "var(--mm-color-opt-1)",
    "var(--mm-color-opt-2)",
    "var(--mm-color-opt-3)",
    "var(--mm-color-opt-4)",
  ];
  return colors[index % colors.length];
}
