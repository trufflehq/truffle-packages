import * as Rx from "https://npm.tfl.dev/rxjs?bundle";

const rx = Rx; // operators, keeping as separate namespace for now

// TODO: clean this up. all the ssr stuff and context isn't really needed anymore

export default function (cb, { useState, useLayoutEffect, useMemo }) {
  const { awaitStable, cache, timeout } = {}; // FIXME
  const { state, hash } = useMemo(function () {
    const initialState = cb();
    // TODO: only call cb() if not nd not awaitStable?
    return {
      state: State(initialState),
      // this is a terrible hash and not unique at all. but i can't think of
      // anything better
      hash: (awaitStable || cache) &&
        (initialState?._ssrCacheKey ||
          JSON.stringify(Object.keys(initialState))),
    };
  }, []);

  // if you get "useState is not a function or its return value is not iterable"
  // check that you don't have any weird stuff like useRef in a hook or callback
  let [value, setValue] = useState(state.getValue());
  const [, updateState] = useState();
  const forceRender = () => updateState({});
  const [error, setError] = useState(null);

  if (error != null) {
    throw error;
  }

  if (typeof document !== "undefined" && window !== null) {
    useLayoutEffect(() => {
      const subscription = state.subscribe((state) => {
        // FIXME: unsub to state immediately after route change
        // unsub should happen before subbb (except for requestsStream observable)
        // problem is all observables rely on requestStream (for org)
        setValue(state);
        // state is an object, so react thinks it hasn't changed.
        // one option is to clone the state obj, but forcing a rerender
        // seems to be more performant
        forceRender();
      }, setError);
      // TODO: tests for unsubscribe
      return () => {
        subscription.unsubscribe();
      };
    }, []);
  } else if (awaitStable) {
    useMemo(() => { // this memo is technically pointless since it only renders once
      if (awaitStable) {
        const stableTimeout = setTimeout(
          () => console.log("timeout", hash),
          timeout,
        );
        return awaitStable(
          state._onStable().then((stableDisposable) => {
            clearTimeout(stableTimeout);
            setValue(value = state.getValue());
            cache[hash] = value;
            return stableDisposable;
          }),
        );
      }
    }, [awaitStable]);
  } else if (cache?.[hash]) {
    value = cache[hash];
  }

  return value;
}

function State(initialState) {
  if (!isPlainObject(initialState)) {
    throw new Error("initialState must be a plain object");
  }

  let currentState = Object.fromEntries(
    Object.entries(initialState).map(([key, val]) => {
      if (val?.subscribe != null) {
        try {
          let value;
          // behaviorsubjects & obs with startWith
          val.pipe(rx.take(1)).subscribe((subValue) => {
            value = subValue;
          });
          // don't return observables
          return [key, value?.subscribe ? null : value];
        } catch {
          return [key, null];
        }
      } else {
        return [key, val];
      }
    }),
  );
  const stateSubject = new Rx.BehaviorSubject(currentState);
  const observables = pickBy(initialState, (x) => x?.subscribe != null);

  const state = Rx.combineLatest(
    [stateSubject].concat(
      Object.entries(observables).map(([key, val]) =>
        // defer seems unnecessary. removing for slight per improvement?
        // Rx.defer(() => Rx.of(currentState[key]))
        // Rx.of(currentState[key])
        //   .pipe(
        //     rx.concat(
        val.pipe(
          rx.distinctUntilChanged(),
          rx.tap((update) => {
            if (currentState[key] !== update) {
              currentState[key] = update;
            }
          }),
          // if an obs never completes, the state for that component
          // just hangs forever since the combineLatest is waiting for all.
          // this prevents that
          rx.startWith(currentState[key]),
        )
        //   ),
        //   rx.distinctUntilChanged()
        // )
      ),
    ),
  ).pipe(rx.map(() => currentState));

  state.getValue = () => currentState;
  state.set = function (diff) {
    if (!isPlainObject(diff)) {
      throw new Error("diff must be a plain object");
    }

    let didReplace = false;
    Object.entries(diff).map((val, key) => {
      if (initialState[key]?.subscribe != null) {
        throw new Error("Attempted to set observable value");
      } else {
        if (currentState[key] !== val) {
          didReplace = true;
        }
      }
    });

    if (didReplace) {
      currentState = { ...currentState, ...diff };
      return stateSubject.next(currentState);
    }
  };

  // only need for ssr
  if ((typeof document === "undefined")) {
    const pendingStream = Object.values(observables || {}).length === 0
      ? Rx.of(null)
      : Rx.combineLatest(
        Object.entries(observables).map((val, key) =>
          val.pipe(
            rx.tap((update) => {
              currentState = { ...currentState, [key]: update };
            }),
          )
        ),
      );

    let stablePromise = null;
    state._onStable = function () {
      if (stablePromise != null) {
        return stablePromise;
      }
      // NOTE: we subscribe here instead of take(1) to allow for state
      //  updates caused by chilren to their parents (who have already stabilized)
      let disposable = null;
      stablePromise = new Promise((resolve, reject) => {
        disposable = pendingStream.subscribe(resolve, reject);
      })
        .catch(function (err) {
          disposable?.unsubscribe();
          throw err;
        })
        .then(() => disposable);
    };
  }

  return state;
}

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function pickBy(object, predicate = (v) => v) {
  return Object.fromEntries(
    Object.entries(object).filter(([, v]) => predicate(v)),
  );
}
