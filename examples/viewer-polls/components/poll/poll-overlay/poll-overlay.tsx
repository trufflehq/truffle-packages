import React from "https://npm.tfl.dev/react";
import Stylesheet from "https://tfl.dev/@truffle/ui@~0.0.3/components/stylesheet/stylesheet.tag.ts";
import PollOptions from "../poll-options/poll-options.tsx";
import PollBody from "../poll-body/poll-body.tsx";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";
import styleSheet from "./poll-overlay.scss.js";

import { useFetchPoll } from "../hooks.ts";
type PollOverlayProps = {
  pollId?: string;
};

export default function PollOverlay({ pollId }: PollOverlayProps) {
  const latestPoll = useFetchPoll({ pollId });
  useStyleSheet(styleSheet);
  const pollTitle = latestPoll?.question;
  const pollOptions = latestPoll?.options;

  return (
    <div className="c-poll-overlay">
      <Stylesheet url={new URL("./poll-overlay.css", import.meta.url)} />
      <PollBody pollTitle={pollTitle}>
        <PollOptions
          isTransparent={true}
          pollOptions={pollOptions}
        />
      </PollBody>
    </div>
  );
}
