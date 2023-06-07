import { signal, useObserve, useSelector } from "../../deps.ts";

// TODO: move to utils package?
export default function useTimer(
  { timerMs$, direction = "down" }: {
    timerMs$: signal<number>;
    direction?: "up" | "down";
  },
) {
  useObserve(() => {
    const timerMs = timerMs$.get();
    const startTimeMs = Date.now();
    // time diff because setTimeout stops when browser tab isn't active
    const timeout = setTimeout(() => {
      const curVal = timerMs;
      const nowMs = Date.now();
      if (curVal > 0 || direction === "up") {
        const timeDiffMs = nowMs - startTimeMs;
        let newVal = direction === "up"
          ? curVal + timeDiffMs
          : curVal - timeDiffMs;
        if (newVal < 0) {
          newVal = 0;
        }

        timerMs$.set(newVal);
      }
    }, 950); // a little less than 1 second to prevent rendering a 2 second difference since js takes some ms too

    return () => {
      clearTimeout(timeout);
    };
  });
}
