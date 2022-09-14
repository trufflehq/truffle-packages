import { globalContext, ProgressPrimitive, React, TextField, useEffect, useMemo, useRef, useState, useStyleSheet } from "../../deps.ts";
import { useInterval } from '../../hooks/mod.ts'
import styleSheet from "./progress-bar.scss.js";

type ProgressProps = {
   children: React.ReactNode 
   max?: number
   value: number
}
function Progress({ children, max, value }: ProgressProps) {
  return (
    <ProgressPrimitive.Root className='c-progress' max={max} value={value}>
      {children}
    </ProgressPrimitive.Root>
  );
}

function ProgressIndicator({ value }: { value: number}) {
  return <ProgressPrimitive.ProgressIndicator className='c-progress-indicator' style={{ transform: `translateX(-${100 - value}%)` }} />
}

function secondsBetweenDates (startDate?: Date, endDate?: Date) {
  if(!startDate || !endDate) {
    return 0
  }
  const diff =  new Date(endDate)?.getTime() - new Date(startDate)?.getTime()

  const secondsBetween = diff / 1000;
  const roundedSeconds = Math.round(secondsBetween);

  return roundedSeconds
}

export default function ProgressBar({ startDate, endDate }: { startDate?: Date; endDate?: Date }) {
  const [secondsRemaining, setSecondsRemaining] = useState()
  useStyleSheet(styleSheet)
  useInterval(() => {
    const timeRemaining = secondsBetweenDates(new Date(Date.now()), endDate)

    setSecondsRemaining(timeRemaining)
  }, 1)

  const maxSeconds = secondsBetweenDates(startDate, endDate)

  const percentage = Math.round(secondsRemaining / maxSeconds * 100)
  return <Progress max={maxSeconds} value={secondsRemaining}>
    <ProgressIndicator value={percentage} />
  </Progress>
}
