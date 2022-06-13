import React, { useEffect, useMemo } from 'react'

import { createSubject, op } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import useObservables from 'https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js'

import styles from './snack-bar-container.css' assert { type: 'css' }
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles]

const DEFAULT_VISIBILITY_DURATION_MS = 5000

export default function SnackBarContainer ({ snackBarQueueSubject, visibilityDuration = DEFAULT_VISIBILITY_DURATION_MS }) {

  const { snackBarQueue, currentSnackBar: $currentSnackBar } = useObservables(() => ({
    snackBarQueue: snackBarQueueSubject.obs,
    currentSnackBar: snackBarQueueSubject.obs.pipe(
      op.map((queue) => queue?.[0])
    )
  }))

  const shouldRenderSnackBar = snackBarQueue.length > 0

  useEffect(() => {
    // after a specified duration, pop off the snackbar at the front of the queue;
    // this will trigger another execution of this function by useEffect
    if (snackBarQueue.length > 0)
      setTimeout(() => snackBarQueueSubject.next(snackBarQueue.slice(1)), visibilityDuration)
  }, [snackBarQueue])

  return (
    <div className='z-snack-bar-container'>{ shouldRenderSnackBar && <$currentSnackBar /> }</div>
  )
}
