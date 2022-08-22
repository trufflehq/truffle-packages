import { React, useStyleSheet } from '../../deps.ts'
import { PollOption as PollOptionType } from "../../types/mod.ts";
import { largestRemainderRound } from "../../utils/mod.ts";
import PollOption from "../poll-option/poll-option.tsx";
import styleSheet from "./poll-options.scss.js";

type PollOptionsProps = {
  pollOptions?: PollOptionType[];
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
  }, 0) || 0;
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
