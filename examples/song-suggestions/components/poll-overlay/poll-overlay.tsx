import { React, useStyleSheet } from "../../deps.ts";

import PollOptions from "../poll-options/poll-options.tsx";
import PollBody from "../poll-body/poll-body.tsx";
import styleSheet from "./poll-overlay.scss.js";

import { useFetchPoll } from "../../hooks/mod.ts";

type PollOverlayProps = {
  pollId?: string;
};

export default function PollOverlay({ pollId }: PollOverlayProps) {
  const latestPoll = useFetchPoll({ pollId });
  useStyleSheet(styleSheet);
  const pollOptions = latestPoll?.options;

  return (
    <div className="c-poll-overlay">
      <PollBody poll={latestPoll}>
        <PollOptions isTransparent={true} pollOptions={pollOptions} />
      </PollBody>
    </div>
  );
}
