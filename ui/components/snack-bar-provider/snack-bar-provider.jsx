import React, { useEffect, useMemo, createContext, useContext } from 'react'

import { createSubject, op } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import useObservables from 'https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js'

import styles from './snack-bar-provider.css' assert { type: 'css' }
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles]

class SnackBarSerivce {

  _queueSubject

  constructor () {
    this._queueSubject = createSubject([])
  }

  get queueSubject () {
    return this._queueSubject
  }

  enqueueSnackBar (snackBar) {
    const currentQueue = this._queueSubject.getValue()
    this._queueSubject.next(currentQueue.concat(snackBar))
  }
}

export const snackBarContext = createContext(new SnackBarSerivce())

const DEFAULT_VISIBILITY_DURATION_MS = 5000

export default function SnackBarProvider ({ children, visibilityDuration = DEFAULT_VISIBILITY_DURATION_MS }) {

  const snackBarService = useContext(snackBarContext)
  const snackBarQueueSubject = snackBarService.queueSubject

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
    <>
      <div className='c-snack-bar-container'>{ shouldRenderSnackBar && <$currentSnackBar /> }</div>
      { children }
    </>
  )
}
