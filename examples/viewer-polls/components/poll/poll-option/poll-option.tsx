import React from "https://npm.tfl.dev/react";
import classKebab from "https://tfl.dev/@truffle/utils@0.0.1/legacy/class-kebab.js";
import Stylesheet from "https://tfl.dev/@truffle/ui@~0.0.3/components/stylesheet/stylesheet.tag.ts";
import { PollOption as PollOptionType } from "../types.ts";

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
      <Stylesheet url={new URL("./poll-option.css", import.meta.url)} />
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
