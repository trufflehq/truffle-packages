import { useMemo } from "./deps.ts";
import { signal } from "./signal.ts";

/*
* returns a memoized signal to persist the signal across re-renders if the signal
* is instantiated in a React component
*/
export function useSignal<T>(initialValue: T | Promise<T>) {
  const signal$ = useMemo(() => {
    return signal(initialValue);
  }, []);

  return signal$;
}
