import {
  _,
  Observable,
  ObservableObject,
  useMemo,
  useObserve,
} from "./deps.ts";
import { signal } from "./signal.ts";
import { updateSignalOnChange } from "./utils.ts";

const isFunction = (inp: unknown) => typeof inp === "function";

/*
* returns a memoized signal to persist the signal across re-renders if the signal
* is instantiated in a React component
*/
export function useSignal<T>(
  initialValue: T | (() => T) | (() => Promise<T>),
) {
  const signal$ = useMemo(() => {
    return signal(
      isFunction(initialValue as () => T)
        ? (initialValue as () => T)()
        : (initialValue as T),
    );
  }, []);

  return signal$;
}

/**
 * Hook to update a signal only when the parent signal changes
 *
 * @param signal$ signal to update
 * @param parent$ signal to update from
 */
export function useUpdateSignalOnChange<T extends object>(
  signal$: Observable<T>,
  parent$: ObservableObject<T | undefined> | undefined,
) {
  useObserve(() => {
    const updatedValue = parent$?.get() as T;

    updateSignalOnChange(signal$, updatedValue);
  });
}
