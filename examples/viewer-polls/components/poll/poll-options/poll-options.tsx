import React from "https://npm.tfl.dev/react";
import { PollOption as PollOptionType } from "../types.ts";
import { largestRemainderRound } from "../utils.ts";
import PollOption from "../poll-option/poll-option.tsx";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.4/format/wc/react/index.ts";
import styleSheet from "./poll-options.scss.js";
type PollOptionsProps = {
  pollOptions: PollOptionType[];
  isTransparent?: boolean;
  selectedIndex?: number;
  isVotingEnabled?: boolean;
  handleOptionSelection?: (index: number) => void;
};

export default function PollOptions(
  {
    pollOptions,
    selectedIndex,
    isVotingEnabled,
    isTransparent,
    handleOptionSelection,
  }: PollOptionsProps,
) {
  useStyleSheet(styleSheet);
  const totalVotes = pollOptions?.reduce((acc: number, curr) => {
    acc = acc + curr.count;
    return acc;
  }, 0);
  const rawPollOptionVotes = pollOptions?.map((option) =>
    option.count ? Math.floor((option.count / totalVotes) * 100) : 0
  );
  const roundedVotePercentages = largestRemainderRound(rawPollOptionVotes, 100);

  return (
    <div className="c-poll-options">
      {pollOptions &&
        pollOptions.map((option, i) => {
          return (
            <PollOption
              isTransparent={isTransparent}
              option={option}
              index={i}
              selectedIndex={selectedIndex}
              isVotingEnabled={isVotingEnabled}
              handleSelect={handleOptionSelection}
              roundedVotePercentages={roundedVotePercentages}
            />
          );
        })}
    </div>
  );
}
