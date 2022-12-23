import {
  ProgressPrimitive,
  React,
  useState,
  useStyleSheet,
} from "../../../deps.ts";
import { useInterval } from "./hooks.ts";
import styleSheet from "./progress-bar.scss.js";

type ProgressProps = {
  children: React.ReactNode;
  max?: number;
  value: number;
};
function Progress({ children, max, value }: ProgressProps) {
  return (
    <ProgressPrimitive.Root className="c-progress" max={max} value={value}>
      {children}
    </ProgressPrimitive.Root>
  );
}

function ProgressIndicator(
  { value, color = "var(--tfl-color-primary-fill)" }: {
    value: number;
    color?: string;
  },
) {
  return (
    <ProgressPrimitive.ProgressIndicator
      className="c-progress-indicator"
      style={{
        transform: `translateX(-${100 - value}%)`,
        backgroundColor: color,
      }}
    />
  );
}

function secondsBetweenDates(startDate?: Date, endDate?: Date) {
  if (!startDate || !endDate) {
    return 0;
  }
  const diff = new Date(endDate)?.getTime() - new Date(startDate)?.getTime();

  const secondsBetween = diff / 1000;
  const roundedSeconds = Math.round(secondsBetween);

  return roundedSeconds;
}

export default function ProgressBar(
  { startDate, endDate, color }: {
    startDate?: Date;
    endDate?: Date;
    color?: string;
  },
) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  useStyleSheet(styleSheet);
  useInterval(() => {
    const timeRemaining = secondsBetweenDates(new Date(Date.now()), endDate);

    setSecondsRemaining(timeRemaining);
  }, 1);

  const maxSeconds = secondsBetweenDates(startDate, endDate);

  const percentage = Math.round(secondsRemaining / maxSeconds * 100);
  return (
    <Progress max={maxSeconds} value={secondsRemaining}>
      <ProgressIndicator value={percentage} color={color} />
    </Progress>
  );
}
