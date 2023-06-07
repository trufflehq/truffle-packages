import React from "https://npm.tfl.dev/react";
import {
  ONE_HOUR_MS,
  ONE_MINUTE_MS,
  ONE_SECOND_MS,
  pad,
} from "../../shared/mod.ts";

export default function Time({ ms }: { ms: number }) {
  const hours = Math.floor(ms / ONE_HOUR_MS);
  ms = ms % ONE_HOUR_MS;
  const minutes = Math.floor(ms / ONE_MINUTE_MS);
  ms = ms % ONE_MINUTE_MS;
  const seconds = Math.floor(ms / ONE_SECOND_MS);

  return (
    <span className="timer">
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
}
