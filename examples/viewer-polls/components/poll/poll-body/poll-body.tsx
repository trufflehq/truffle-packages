import React from "https://npm.tfl.dev/react";
import CountdownTimer from "../../timer/timer.tsx";
import Stylesheet from "https://tfl.dev/@truffle/ui@~0.0.3/components/stylesheet/stylesheet.tag.ts";

type PollBodyProps = {
  pollTitle: string;
  pollEndTime?: Date;
  children: any; // FIXME: Once npm.tfl.dev resolves react types fix the types here
};

export default function PollBody(
  { pollTitle, pollEndTime, children }: PollBodyProps,
) {
  return (
    <div className="c-poll-body">
      <Stylesheet url={new URL("./poll-body.css", import.meta.url)} />
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
