import React from "https://npm.tfl.dev/react";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";

import styleSheet from "./poll-body.scss.js";
import CountdownTimer from "../../timer/timer.tsx";

type PollBodyProps = {
  pollTitle: string;
  pollEndTime?: Date;
  children: any; // FIXME: Once npm.tfl.dev resolves react types fix the types here
};

export default function PollBody(
  { pollTitle, pollEndTime, children }: PollBodyProps,
) {
  useStyleSheet(styleSheet);

  return (
    <div className="c-poll-body">
      <header>
        <div className="title">
          {pollTitle}
        </div>
        {pollEndTime && (
          <div className="countdown">
            <CountdownTimer endTime={pollEndTime} />
          </div>
        )}
      </header>
      <div className="body">
        {children}
      </div>
    </div>
  );
}
