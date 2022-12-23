import {
  CombinedError,
  getClient,
  observable,
  pipe,
  subscribe,
  TypedDocumentNode,
  useCallback,
  useObservable,
  useQuery,
  UseQueryState,
  useObserve,
  _,
  Observable,
  ObservableObject,
} from "../../deps.ts";

/*
* FIXME - replace once we upgrade the legend version of @truffle/state
*/
export function useQuerySignal<T extends object>(
  query: TypedDocumentNode<T, any>,
  variables?: any,
) {
  const signal$ = observable<T & { error: CombinedError | undefined }>(
    undefined!,
  );
  pipe(
    getClient().query(query, variables),
    subscribe((res) => {
      if (res?.data) {
        signal$.set({ ...res.data, error: undefined });
      }

      // if there's an error in the response, set the `error` observable of the signal
      // but don't void the existing `value` observable since we don't want to lose the last good value
      // and will handle errors separately through updates to the error observable
      if (res?.error) {
        signal$.set((prev) => ({ ...prev, error: res.error }));
      }
    }),
  );
  return signal$;
}

/**
 * FIXME - replace once we upgrade the legend version of @truffle/state
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

/**
 * FIXME - replace once we upgrade the legend version of @truffle/state
 * Update a signal only if the value has changed
 *
 * @param signal$ signal to update
 * @param value value to update the signal with
 */
export function updateSignalOnChange<T extends object>(
  signal$: Observable<T>,
  value: T | undefined,
) {
  const currentValue = signal$.get() as T;

  if (value && !_.isEqual(value, currentValue)) {
    signal$.set(value);
  }
}