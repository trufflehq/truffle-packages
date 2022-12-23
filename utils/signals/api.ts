import {
  CombinedError,
  getClient,
  ObservableObject,
  pipe,
  subscribe,
  TypedDocumentNode,
  useCallback,
  useQuery,
  UseQueryState,
} from "./deps.ts";
import { signal } from "./signal.ts";
import { useSignal } from "./hooks.ts";

/*
* This is a custom hook that wraps the useQuery hook from urql.
* TODO: consolidate with useQuerySignal. Problem with useQuerySignal is it doesn't return `fetching`
*/
export function useUrqlQuerySignal<T extends object>(
  query: TypedDocumentNode<T, any>,
  variables?: any,
) {
  const signal$ = useSignal<UseQueryState<T, object>>(undefined!);

  const source = useCallback(() => useQuery<T>({ query, variables }), [
    query,
    variables,
  ]);
  const [result, reexecuteQuery] = source();

  signal$.set(result);

  return { signal$, reexecuteQuery };
}

/** @internal */
function apiSignal<T extends object & { error: CombinedError | undefined }>(
  initialValue: T | Promise<T>,
) {
  return signal<T>(initialValue) as ObservableObject<T>;
}

/*
 * This hook creates a signal that subscribes to a graphql query. Can access the value of the response from the `value`
 * observable of the signal and any errors on the `error` observable.
*/
export function useQuerySignal<T extends object>(
  query: TypedDocumentNode<T, any>,
  variables?: any,
) {
  const signal$ = apiSignal<T & { error: CombinedError | undefined }>(
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

export type TruffleQuerySignal<T> = ObservableObject<
  T & { error: CombinedError | undefined }
>;
