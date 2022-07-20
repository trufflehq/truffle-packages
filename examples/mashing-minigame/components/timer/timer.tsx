import React, { useEffect, useRef, useState } from "https://npm.tfl.dev/react";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";
import styleSheet from "./timer.scss.js";
enum Status {
  STARTED = "Started",
  STOPPED = "Stopped",
}

type CountdownTimerProps = {
  className?: string
  endTime: Date
}

export default function CountdownTimer({ className, endTime }: CountdownTimerProps) {
  const [millisecondsRemaining, setmilliSecondsRemaining] = useState();
  const [status, setStatus] = useState(Status.STOPPED);
  const [delay, setDelay] = useState(1);
  useStyleSheet(styleSheet);

  const millisecondsToDisplay = Math.round((millisecondsRemaining % 1000) * 10) / 10;
  const secondsToDisplay = Math.round((millisecondsRemaining / 1000) % 60);
  const minutesRemaining = ((millisecondsRemaining / 1000) - secondsToDisplay) / 60;
  const minutesToDisplay = Math.round(minutesRemaining % 60);
  useEffect(() => {
    setStatus(Status.STARTED);
    setDelay(1);
    const start = new Date().getTime();
    const end = new Date(endTime).getTime();
    const timeRemaining = (end - start) / 1000;
    setmilliSecondsRemaining(timeRemaining);
  }, [endTime]);

  useInterval(
    () => {
      const start = new Date().getTime();
      const end = new Date(endTime).getTime();
      const timeRemaining = (end - start) / delay;

      if (millisecondsRemaining > 0) {
        setmilliSecondsRemaining(timeRemaining);
      } else {
        setStatus(Status.STOPPED);
      }
    },
    status === Status.STARTED ? delay : null,
    // passing null stops the interval
  );

  const hasEnded = millisecondsRemaining < 0 || isNaN(millisecondsRemaining);
  return (
    <div className={`timer ${className || ''}`}>
      <>
        {hasEnded
          ?<div className='finish'>
          </div> 
          : `${staticDigits(minutesToDisplay)}:${
            staticDigits(secondsToDisplay)
          }:${staticDigits(millisecondsToDisplay, 3)}`}
      </>
    </div>
  );
}

// source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// https://stackoverflow.com/a/2998874/1673761
const staticDigits = (num, pad = 2) => {
  num = num < 0 ? 0 : num;
  return String(num).padStart(pad, "0");
};
