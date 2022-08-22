import { React, useStyleSheet } from "../../deps.ts";
import { Poll } from "../../types/mod.ts";
import stylesheet from "./poll-indicator-icon.scss.js";
import { getRoundedPollPercentages } from "../../utils/mod.ts";

export default function PollResultIndicatorIcon({ poll }: { poll: Poll }) {
  const roundedVotePercentages = getRoundedPollPercentages(poll.options);
  useStyleSheet(stylesheet);
  const yesPercentage = roundedVotePercentages?.[0] || 0;
  const noPercentage = roundedVotePercentages?.[1] || 0;

  const isApproved = yesPercentage >= 65;
  const isBanned = noPercentage >= 65;
  return (
    <img
      className=".c-poll-indicator-icon"
      src={
        isApproved
          ? "https://cdn.betterttv.net/emote/5b1740221c5a6065a7bad4b5/2x"
          : isBanned
          ? "https://cdn.betterttv.net/emote/5ec39a9db289582eef76f733/2x"
          : "https://cdn.betterttv.net/emote/61904b1d54f3344f88058bb2/2x"
      }
    />
  );
}
