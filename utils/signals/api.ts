import {
  CombinedError,
  getClient,
  observable,
  ObservableObjectOrArray,
  pipe,
  subscribe,
  TypedDocumentNode,
  useCallback,
  useQuery,
  UseQueryState,
} from "./deps.ts";
import { useSignal } from "./hooks.ts";

/*
* This is a custom hook that wraps the useQuery hook from urql.
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

  signal$.set!({ value: result });

  return { signal$, reexecuteQuery };
}

/** @internal */
function apiSignal<T extends unknown>(
  initialValue: T | Promise<T>,
): ObservableObjectOrArray<
  { value: T; error: CombinedError | undefined }
> {
  return observable({
    value: initialValue,
    error: undefined,
  }) as ObservableObjectOrArray<
    { value: T; error: CombinedError | undefined }
  >;
}

/*
 * This hook creates a signal that subscribes to a graphql query. Can access the value of the response on the `value`
  * property of the signal and any errors on the `error` property.
*/
export function useQuerySignal<T extends object>(
  query: TypedDocumentNode<T, any>,
  variables?: any,
) {
  const signal$ = apiSignal<T>(undefined!);
  pipe(
    getClient().query(query, variables),
    subscribe((res) => {
      if (res?.data) {
        signal$.set!({ value: res.data, error: undefined });
      }

      if (res?.error) {
        signal$.set!((prev) => ({ ...prev, error: res.error }));
      }
    }),
  );
  return signal$;
}
