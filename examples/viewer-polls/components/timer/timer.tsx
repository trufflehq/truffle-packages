import React, { useEffect, useRef, useState } from "https://npm.tfl.dev/react";
import Stylesheet from "https://tfl.dev/@truffle/ui@~0.0.3/components/stylesheet/stylesheet.tag.ts";

// const STATUS = {
//   STARTED: "Started",
//   STOPPED: "Stopped",
// };

enum Status {
  STARTED = "Started",
  STOPPED = "Stopped",
}

export default function CountdownTimer({ endTime }) {
  const [secondsRemaining, setSecondsRemaining] = useState();
  const [status, setStatus] = useState(Status.STOPPED);
  const [delay, setDelay] = useState(1000);

  const secondsToDisplay = Math.round(secondsRemaining % 60);
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = Math.round(minutesRemaining % 60);
  useEffect(() => {
    setStatus(Status.STARTED);
    setDelay(1000);
    const start = new Date().getTime();
    const end = new Date(endTime).getTime();
    const timeRemaining = (end - start) / 1000;
    setSecondsRemaining(timeRemaining);
  }, [endTime]);

  useInterval(
    () => {
      const start = new Date().getTime();
      const end = new Date(endTime).getTime();
      const timeRemaining = (end - start) / 1000;

      if (secondsRemaining > 0) {
        setSecondsRemaining(timeRemaining);
      } else {
        setStatus(Status.STOPPED);
      }
    },
    status === Status.STARTED ? delay : null,
    // passing null stops the interval
  );

  const hasEnded = secondsRemaining < 0 || isNaN(secondsRemaining);
  return (
    <div className="timer">
      <Stylesheet url={new URL("./timer.css", import.meta.url)} />
      <>
        {hasEnded
          ? `Submissions closed`
          : `Submissions closing in ${twoDigits(minutesToDisplay)}:${
            twoDigits(secondsToDisplay)
          }`}
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
const twoDigits = (num) => {
  num = num < 0 ? 0 : num;
  return String(num).padStart(2, "0");
};
