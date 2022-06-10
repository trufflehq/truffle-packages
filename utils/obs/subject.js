import * as Rx from 'https://esm.sh/rxjs?bundle'
import _ from 'https://esm.sh/lodash?no-check'
// TODO: figure out an alternative to this package. it's 10kb
// and probably doesn't need to be (it pulls in from some packages that are
// similar to lodash, but not lodash: http://bundlephobia.com/package/dot-wild)
import * as dot from 'https://esm.sh/dot-wild'

const rx = Rx // operators, keeping separate namespace for now

export const ajax = Rx.ajax

// just to try to keep our implementation of rx simple, let's try
// to limit to just these operators. that way when onboarding new
// engineers, they don't have to learn entirety of rxjs, just how we use it

// operators, to be used inside of .pipe()
export const op = {
  // applies a projection to each observable value
  map: rx.map,
  // applies a projection to each observable value
  switchMap: rx.switchMap,

  // use observable value w/o passing projection to next observable
  tap: rx.tap,
  // similar to map, but use if the function is returning an observable
  // instead of a primative
  filter: rx.filter,
  // use to prevent additional renders
  // observable when only emit when the value is changed
  // eg rx.distinctUntilChanged((prev, cur) => prev === cur)
  distinctUntilChanged: rx.distinctUntilChanged,
  // take only the the first X values emitted from observable
  // we usually use this for:
  // .pipe(rx.take(1)).toPromise()
  take: rx.take,

  // catch error from observable and do something with it
  catchError: rx.catchError,
  // default value for an observable
  // (if we don't want to wait for observable to emit)
  startWith: rx.startWith,
  // debounce values (similar to lodash debounce)
  // eg if it's a search input and you don't want it to make a ton of queries
  debounceTime: rx.debounceTime,

  delay: rx.delay,
  // TODO: simplify all below. we might be able to publishReplay(1).refCount()
  // everything
  //
  // we use variations of these last 4 to make it so if the observable is
  // subscribed to in multiple places, it reuses the value everywhere instead
  // of running through all of the pipe functions again.
  //
  // the difference is in what happens when there are no longer any
  // observers subscribed to the observable anymore.
  // iirc, publishReplay(1).refCount() will reset the value when there aren't
  // any subscribers, and shareReplay doesn't
  publishReplay: rx.publishReplay,
  refCount: rx.refCount,
  share: rx.share,
  shareReplay: rx.shareReplay,

  //
  // NOTE: you hopefully won't need to use these

  // we use with replaySubjects. gets the value of an obsevable that is
  // currently set on an observable
  switchAll: rx.switchAll,
  // apply a function to each item emitted by an Observable, sequentially,
  // and emit each successive value
  scan: rx.scan
}

// functions that return observables
export const Obs = {
  // combines latest value from multiple observables into a single observable
  // eg. Obs.combineLatest(obs1, obs2).pipe((op.map([obs1Value, obs2Value]) => null))
  combineLatest: Rx.combineLatest,
  // creates an observable from a primative value
  // eg. Obs.of('abc')
  of: Rx.of,
  // observable that never returns a value
  never: Rx.never,
  // creates an observable from a promise
  from: Rx.from,
  // merges two observables into a single observable
  // rx.map will have the value from whichever was updated most recently,
  // compared to combineLatest which is an array of both values
  merge: Rx.merge,

  interval: Rx.interval,
  //

  // NOTE: you hopefully won't need to use these
  // TODO: we should try abstracting this into createSubject too
  // we currently use for onSetModifierReplaySubject
  // and observables that hold several other observables
  ReplaySubject: Rx.ReplaySubject,
  // we use this in graphql_client for a websocket batch request
  AsyncSubject: Rx.AsyncSubject,
  // used in graphql_client as ssr alternative to replaysubject
  BehaviorSubject: Rx.BehaviorSubject
}

// To simplify rxjs for our use-case, we always use this "Obs" object, rather
// than BehaviorSubject, Observable, etc...

// This is an observable that behaves like BehaviorSubject (ie it can be '.next'ed)
// the big difference is it can start from another Obs/observable, rather than
// just primative types. When the observable it was created with updates, the value
// will update.

// Also has methods for
// - `isChanged` (if it has been `.next`ed)
// - `reset` (reset to the current obervable's value)
// - `replaceObs` change the main observable backing this stream
// - `getValue` synchronous way to get current value
// - `createSubjectFromConfig` creates a child stream that can update parent stream when child stream changes

// Observable vs Subject: https://stackoverflow.com/a/47538989
// Our "Obs" is similar to a subject, just the observable is on .obs

// there's a good chance all of this can be optimized quite a bit by
// someone with a better understanding of rxjs
/**
 * @param {any} [observableOrPrimative] pass in whatever you want the stream's initial value/observable to be
 * @param {Object} [options]
 * @param {Object[]} [options.childStreamConfigs] use if you want to create streams you can update from the main source value
 * @param {string} [options.childStreamConfigs[].objectPath] if you're wanting to start the stream from an object in an array, pass in the dot path to it
 * @param {string} [options.childStreamConfigs[].valuePath] value the stream should start with relative to the object fetched from objectPath
 * @param {string} [options.childStreamConfigs[].idPath] a unique identifier for the object (stream gets cached with this). relative to object fetched from objectPath. used to cache the stream
 * @param {string} [options.childStreamConfigs[].id] alternatively you can cache the stream with a string instead of idPath
 * @param {string} [options.childStreamConfigs[].streamPath] path to where you want the stream to go. relative to object fetched from objectPath
 * @param {function} [options.childStreamConfigs[].transformFn] if you need to transform the value fetched from valuePath, use this (value) => // do whatever and return new value
 * @param {boolean} [options.childStreamConfigs[].shouldUpdateParentOnChange] typically this doesn't need to be true. if true, the value of the parent will update when this child stream updates
 * @param {function} [options.childStreamConfigs[].parentMergeFn] if shouldUpdateParentOnChange, you can optionally specify how to update the parent value using the child value (parent, child) => { // do stuff }
 * @param {function} [options.shouldPersist] if true, .next's will still work even if there are no current observers of this stream
 */
export function createSubject (observableOrPrimative, options = {}) {
  const { childStreamConfigs, distinctUntilChanged = true, shouldPersist } = options

  const isObservable = Boolean(observableOrPrimative?.subscribe)

  // this might be more performant, for streams that don't need to use observable values
  // though we'd probably want to have an option for it instead of assuming
  // any primitive wants to be a simple BehaviorSubject
  // if (!isObservable) {
  //   const behaviorSubject = new Rx.BehaviorSubject(observableOrPrimative)
  //   return {
  //     obs: behaviorSubject,
  //     next: behaviorSubject.next.bind(behaviorSubject),
  //     // isChanged: () => currentValue !== cachedObsResult,
  //     // reset: () => nextableReplaySubject.next(cachedObsResult),
  //     // replaceObs,
  //     // createChildStreamFromConfig: createChildStreamFromConfig,
  //     getValue: behaviorSubject.getValue.bind(behaviorSubject)
  //   }
  // }

  const observable = isObservable
    ? observableOrPrimative
    : Rx.of(observableOrPrimative)

  let cachedObsResult, currentValue
  if (!isObservable) {
    currentValue = observableOrPrimative
  }

  const nextableReplaySubject = new Rx.ReplaySubject(0) // nextable w/ non-observables. using instead of behaviorsubject bc it starts w/o value
  // we use this to prevent an infinite loop with createChildStreamFromConfig.
  // that function creates a child stream that pipes off of
  // observableWithNextedValues and then needs to .next the new value to the
  // parent (so child updates parent which updates child).
  // by having separate subject that child stream doesn't pipe off of,
  // we can prevent that
  const internalNextableReplaySubject = new Rx.ReplaySubject(0) // using instead of behaviorsubject bc it starts w/o value
  const observableReplaySubject = new Rx.ReplaySubject(0) // observables (modified with replaceObs)
  // this will update any time a childConfigStream's stream is updated
  const childStreamConfigsReplaySubject = new Rx.ReplaySubject(0)
  observableReplaySubject.next(observable)

  const replaceObs = (observable) => observableReplaySubject.next(observable)

  const cachedChildStreamConfigs = {}
  const next = nextableReplaySubject.next.bind(nextableReplaySubject)
  // this contains any child streams that have shouldUpdateParentOnChange
  const updateChildrenReplaySubject = () => {
    childStreamConfigsReplaySubject.next(
      // subscribe to the childConfigStream's stream
      // for any with shouldUpdateParentOnChange: true
      // and pass in both the stream value and overall config
      Rx.combineLatest(_.filter(_.map(cachedChildStreamConfigs, ({ stream, childStreamConfig }) =>
        childStreamConfig.shouldUpdateParentOnChange && stream.obs.pipe(
          rx.map((value) => ({
            value,
            childStreamConfig
          }))
        )
      )))
    )
  }

  const embedChildStreamInValue = (value, childStreamConfigs) => {
    // add any _streams we want to use to the result
    _.forEach(childStreamConfigs, (childStreamConfig) => {
      const { streamPath, objectPath } = childStreamConfig

      const embedChildStreamAtStreamPath = (childObject, key, context, path) => {
        const childStreamAtPathConfig = { ...childStreamConfig }
        // if no id was specified, use the object path
        if (!childStreamAtPathConfig.id && !childStreamAtPathConfig.idPath) {
          childStreamAtPathConfig.id = `${childStreamAtPathConfig.streamPath}-${path}`
        }
        // so we have the actual index when objectPath = *
        childStreamAtPathConfig.objectPathValue = path
        const stream = createChildStreamFromConfig(childStreamAtPathConfig, childObject)
        value = (path || childObject !== value)
          ? dot.set(value, path, dot.set(childObject, streamPath, stream))
          : dot.set(childObject, streamPath, stream)
      }
      // if objectPath is specified, we'll replace every streamPath within each child object
      // eg objectPath = nodes.* will create a stream from the valuePath in each
      // node and create a stream in each node at the streamPath
      if (objectPath) {
        dot.forEach(value, objectPath, embedChildStreamAtStreamPath)
      } else {
        // if no objectPath is specified, we just apply valuePath and streamPath
        // to the root object for this stream
        embedChildStreamAtStreamPath(value, null, null, '')
      }
    })
    // subscribe to all child streams and update current value of main observable
    // when any change
    updateChildrenReplaySubject()
    return value
  }

  const observableWithNextedValues = Rx.merge(
    nextableReplaySubject.pipe(
      rx.tap((value) => {
        currentValue = value
      })
    ),
    observableReplaySubject.pipe(
      rx.switchAll(),
      // this breaks where eg observable value is 0, then behav sub changes to 1, then observable changes back to 0
      // generally we want this functionality
      // (eg when editing something, cache gets invalidated when leaving /
      // returning to tab - don't want to reset the client changes)
      // if you want it to always reset, use distinctUntilChanged option
      distinctUntilChanged ? rx.distinctUntilChanged(isEqualWithObservables) : rx.tap((val) => val),
      rx.tap((result) => {
        cachedObsResult = result
        currentValue = result
      })
    )
  )

  const observableWithNextedAndInternalNextedValues = Rx.merge(
    observableWithNextedValues,
    internalNextableReplaySubject.pipe(
      rx.tap((value) => {
        currentValue = value
      })
    )
  ).pipe(
    rx.map((value) => {
      if (!_.isEmpty(childStreamConfigs)) {
        return embedChildStreamInValue(value, childStreamConfigs)
      }
      return value
    })
  )

  // just want to have this subscribed to when stream.obs is subscribed to,
  // and unsubscribe when stream.obs no longer subscribed to by any components.
  // there's probably a better way to do this though
  const observableWithNextedAndInternalNextedValuesAndChildListener = Rx.combineLatest(
    observableWithNextedAndInternalNextedValues,
    childStreamConfigsReplaySubject.pipe(
      rx.switchAll(),
      // only if any of child stream values have changed
      rx.distinctUntilChanged(isEqualWithObservables),
      rx.tap((childStreamConfigs) => {
        try {
          // update the nextable with the new value calculated from child stream changes
          _.forEach(childStreamConfigs, ({ childStreamConfig, value }) => {
            if (childStreamConfig.parentMergeFn) {
              currentValue = childStreamConfig.parentMergeFn(currentValue, value)
            } else {
              if (childStreamConfig.objectPathValue) {
                const childObject = dot.get(currentValue, childStreamConfig.objectPathValue)
                // FIXME: this seems to convert File({ obj ... }) into just { obj ... }
                currentValue = dot.set(
                  currentValue,
                  childStreamConfig.objectPathValue,
                  childStreamConfig.valuePath ? dot.set(childObject, childStreamConfig.valuePath, value) : value
                )
              } else {
                currentValue = dot.set(currentValue || {}, childStreamConfig.valuePath, value)
              }
            }
          })
          // this is sort of an infinite loop. it updates parents, which child
          // streams pipe from, so they get updated too, which updates parent
          // again. if we were to use nextableReplaySubject,
          // the only thing that stops it is the rx.distinctUntilChanged.
          // so instead we use internalNextableReplaySubject,
          // and have childStreamFromConfig pipe off of observableWithNextedValues
          internalNextableReplaySubject.next(currentValue)
        } catch (err) {
          console.log('update from child config error', childStreamConfigs, err)
        }
      }),
      rx.startWith('ignoreme')
    )
  ).pipe(
    rx.map(([value, ignoreMe]) => value),
    // this line very important. makes sure the ordering is consistent
    // when new subscriptions occur (so the most recent of observable or subject)
    // is chosen instead of always the observable first
    rx.publishReplay(1), rx.refCount()
  )

  const createChildStream = (observableOrPrimative, childStreamConfig, id) => {
    if (cachedChildStreamConfigs[id]) {
      // stream already exists. we want to keep using, but we can update the value
      const isObservable = observableOrPrimative?.subscribe
      const hasChanged = !isObservable && !_.isEqual(observableOrPrimative, cachedChildStreamConfigs[id].stream.getValue())
      // NOTE: we don't want to update the value if this child *caused* the update
      // TODO: there's probably a better way to do this. involving making sure the parent update happens before this is called
      if (hasChanged && !childStreamConfig.shouldUpdateParentOnChange) {
        cachedChildStreamConfigs[id].stream.next(observableOrPrimative)
      }
    } else {
      cachedChildStreamConfigs[id] = {
        childStreamConfig,
        stream: createSubject(observableOrPrimative)
      }
    }
    return cachedChildStreamConfigs[id]
  }

  // creates a child stream that we'll listen to changes on. any changes to
  // the child stream will update the parent stream (via childStreamConfigsReplaySubject subscription)
  const createChildStreamFromConfig = (childStreamConfig, value) => {
    const { idPath, valuePath, objectPath, streamPath, transformFn = (val) => val } = childStreamConfig
    let { id } = childStreamConfig
    let child
    const isParentObject = !objectPath // parentObject = this child is directly on this stream's value
    if (isParentObject) {
      // listen for any changes to parent, so child will get updated
      const observable = observableWithNextedValues.pipe(
        rx.map((value) => {
          const baseChildValue = valuePath ? dot.get(value, valuePath) : value
          return transformFn(baseChildValue, id)
        })
      )
      // use currentValue of this stream to get id
      id = id || `${streamPath}-${dot.get(currentValue, idPath)}`
      child = createChildStream(observable, childStreamConfig, id)
    } else {
      id = id || `${streamPath}-${dot.get(value, idPath)}`
      const baseChildValue = valuePath ? dot.get(value, valuePath) : value
      const childValue = transformFn(baseChildValue, id)
      child = createChildStream(childValue, childStreamConfig, id)
    }
    updateChildrenReplaySubject()
    return child.stream
  }

  if (shouldPersist) {
    // make sure observable always has a subscriber
    observableWithNextedAndInternalNextedValuesAndChildListener.subscribe()
  }

  return {
    obs: observableWithNextedAndInternalNextedValuesAndChildListener,
    next,
    isChanged: () => {
      const isEmpty = currentValue == null && cachedObsResult == null
      return !isEmpty && !_.isEqual(currentValue, cachedObsResult)
    },
    reset: () => nextableReplaySubject.next(cachedObsResult),
    replaceObs,
    createChildStreamFromConfig: createChildStreamFromConfig,
    // should only use this in save functions where we need to get the current
    // value, but don't necessarily want to have the stream in useStream
    // (for performance reasons, eg not rerendering on every key change)
    getValue: () => currentValue
  }
}

// if we've embedded streams inside this stream value, we want to still
// accurately compare them
function isEqualWithObservables (prevProps, nextProps) {
  return _.isEqualWith(prevProps, nextProps, (val1, val2, key) => {
    if (!key) {
      // not sure why, but lodash tries comparing the entire props objects first
      return undefined
    }
    const val1IsStream = val1?.subscribe
    const val2IsStream = val1?.subscribe
    if (val1IsStream || val2IsStream) {
      return val1IsStream && val1IsStream
    }
    if (typeof val1 === 'object' && typeof val2 === 'object') {
      return _.isEqual(val1, val2)
    }
    // eslint-disable-next-line eqeqeq
    return val1 == val2
  })
}
