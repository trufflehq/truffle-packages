import React, { useEffect, useMemo, createContext, useContext } from 'react'
import root from 'https://npm.tfl.dev/react-shadow@19?deps=react@18&dev'

import { createSubject, op } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import useObservables from 'https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js'

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
    let cancel = false

    function emptyQueue (length) {
      // base case; don't recurse after length goes below zero
      if (length < 0) return
      setTimeout(() => {
        // If the queue has changed,
        // the effect will run again
        // and run emptyQueue again
        // with the new version of
        // the queue.
        // If that happens, we want
        // to cancel this instance
        // of emptyQueue so that
        // we're not double-removing
        // items from the queue.
        if (cancel) return

        // remove item from the front of the queue
        // and schedule the next item to be removed
        snackBarQueueSubject.next(snackBarQueue.slice(1))
        emptyQueue(length - 1)
      }, visibilityDuration)
    }

    emptyQueue(snackBarQueue.length)

    return () => { cancel = true }
  }, [snackBarQueue])

  return (
    <root.div>
      <link
        rel="stylesheet"
        href={new URL('snack-bar-provider.css', import.meta.url).toString()}
      />
      <div className='c-snack-bar-container'>{ shouldRenderSnackBar && <$currentSnackBar /> }</div>
      { children }
    </root.div>
  )
}
