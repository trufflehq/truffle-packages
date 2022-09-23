import {
  getClient,
  pipe,
  subscribe,
  TypedDocumentNode,
  useCallback,
  useQuery,
  UseQueryState,
} from "./deps.ts";
import { useSignal } from "./hooks.ts";
import { signal } from "./signal.ts";

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

/*
 * This hook creates a signal that subscribes to a graphql query
*/
export function useQuerySignal<T extends object>(
  query: TypedDocumentNode<T, any>,
  variables?: any,
) {
  const signal$ = signal<T>(undefined!);
  pipe(
    getClient().query(query, variables),
    subscribe((res) => {
      if (res.data) {
        signal$.set!({ value: res.data });
      }
    }),
  );
  return signal$;
}
