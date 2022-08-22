import { React, classKebab, useStyleSheet } from '../../deps.ts'
import { PollOption as PollOptionType } from "../../types/mod.ts";
import styleSheet from "./poll-option.scss.js";

type PollOptionProps = {
  option: PollOptionType;
  index: number;
  isTransparent?: boolean;
  selectedIndex?: number;
  isVotingEnabled?: boolean;
  handleSelect?: (index: number) => void;
  roundedVotePercentages?: number[] | undefined;
};

export default function PollOption(
  {
    option,
    index,
    isTransparent = false,
    selectedIndex,
    isVotingEnabled,
    handleSelect = () => undefined,
    roundedVotePercentages,
  }: PollOptionProps,
) {
  useStyleSheet(styleSheet);

  return (
    <div
      className={`c-option ${
        classKebab({
          isSelected: option.index === selectedIndex,
          isDisabled: !isVotingEnabled,
          isTransparent,
        })
      }`}
      onClick={() => handleSelect(option.index)}
    >
      <div
        className="progress"
        style={{
          right: `calc(100% - ${roundedVotePercentages?.[index]}%)`,
        }}
      />
      <div className="title">
        {option?.text}
      </div>
      <div className="vote">
        <div className="percentage">
          {`${roundedVotePercentages?.[index]}%`}
        </div>
        <div className="count">
          {`(${option.count})`}
        </div>
      </div>
    </div>
  );
}
