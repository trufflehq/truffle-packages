import React, { useEffect, useRef, useState } from "https://npm.tfl.dev/react";
import Stylesheet from "https://tfl.dev/@truffle/ui@~0.0.3/components/stylesheet/stylesheet.tag.ts";

const STATUS = {
  STARTED: "Started",
  STOPPED: "Stopped",
};

export default function Timer({ initialSeconds }) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [status, setStatus] = useState(STATUS.STOPPED);

  const secondsToDisplay = Math.round(secondsRemaining % 60);
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = Math.round(minutesRemaining % 60);
  const hoursToDisplay = Math.round((minutesRemaining - minutesToDisplay) / 60);

  useEffect(() => {
    setStatus(STATUS.STARTED);
  }, []);

  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        setStatus(STATUS.STOPPED);
      }
    },
    status === STATUS.STARTED ? 1000 : null,
    // passing null stops the interval
  );

  const hasEnded = secondsRemaining < 0;
  return (
    <div className="timer">
      <Stylesheet url={new URL("./timer.css", import.meta.url)} />
      <>
        {hasEnded
          ? `Poll has ended`
          : `${twoDigits(hoursToDisplay)}:${twoDigits(minutesToDisplay)}:
          ${twoDigits(secondsToDisplay)}`}
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
