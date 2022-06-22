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

    if (snackBarQueue.length > 0) {
      setTimeout(() => {
        // If the queue has changed by the time we reach this,
        // we want to cancel removing anything from the queue
        // and let the new version of the effect do it instead.
        if (cancel) return

        // remove item from the front of the queue
        // and schedule the next item to be removed
        snackBarQueueSubject.next(snackBarQueue.slice(1))
      }, visibilityDuration)
    }

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
