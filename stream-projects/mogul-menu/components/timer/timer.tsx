import { formatCountdown, React } from "../../deps.ts";

export default function Timer(
  { timerSeconds, message }: { timerSeconds?: number; message?: string },
) {
  return (
    <div className="timer">
      {
        <>
          <div className="time">
            {timerSeconds !== undefined
              ? formatCountdown(timerSeconds, { shouldAlwaysShowHours: false })
              : ""}
          </div>
          <div className="title">{message}</div>
        </>
      }
    </div>
  );
}
