import { useEffect } from "https://npm.tfl.dev/react";
export { useSelector } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";

function Timer({ timerMs$, Component }) {
  const timerMs = useSelector(() => timerMs$.get());

  useEffect(() => {
    const startTimeMs = Date.now();
    // time diff because setTimeout stops when browser tab isn't active
    const timeout = setTimeout(() => {
      const curVal = timerMs;
      const nowMs = Date.now();
      if (curVal > 0) {
        const timeDiffMs = nowMs - startTimeMs;
        let newVal = curVal - timeDiffMs;
        if (newVal < 0) {
          newVal = 0;
        }
        timerMs$.set(newVal);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [timerMs]);

  return Component ? <Component timerMs={timerMs} /> : `${timerMs}`;
}
