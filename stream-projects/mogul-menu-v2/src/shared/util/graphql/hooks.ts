import {
  signal,
  TypedDocumentNode,
  useCallback,
  useEffect,
  useQuery,
  UseQueryState,
  useSignal,
  useSubscription,
} from "../../../deps.ts";
import { NthParameter } from "../types.ts";

type UseQueryArgs<V, D extends Record<string, any> = Record<string, any>> =
  NthParameter<typeof useQuery<V, D>, 0>;

export function usePollingQuery<
  V = object,
  D extends Record<string, any> = Record<string, any>,
>(
  interval: number,
  queryInput: UseQueryArgs<V, D>,
) {
  const [result, reexecuteQuery] = useQuery(queryInput);

  useEffect(() => {
    const intId = setInterval(() => {
      reexecuteQuery({ requestPolicy: "network-only" });
    }, interval);

    return () => {
      clearInterval(intId);
    };
  }, [JSON.stringify(queryInput)]);

  return result;
}

export function useUrqlQuerySignal(query: any, variables?: any, args?: any) {
  const [result, reexecuteQuery] = useQuery({
    query,
    variables,
    ...args,
  });

  const signal$ = useSignal(result);

  useEffect(() => {
    signal$.set(result);
  }, [result]);

  return { signal$, reexecuteQuery };
}

/*
* This is a custom hook that wraps the useSubscription hook from urql.
*/
// TODO: this will cause a re-render in the component that calls this.
// that's fine most of the time, but for better perf we should probably
// hook directly into urql client.subscription
export function useSubscriptionSignal<T extends object>(
  query: TypedDocumentNode<T, any>,
  variables?: any,
) {
  const source = useCallback(() => useSubscription<T>({ query, variables }), [
    query,
    variables,
  ]);
  const [result, reexecuteQuery] = source();

  const signal$ = useSignal<typeof result>(undefined!);

  signal$.set(result);

  return { signal$, reexecuteQuery };
}

export function useQuerySignal(query: any, variables?: any, args?: any) {
  return useUrqlQuerySignal(query, variables, args).signal$;
}

/**
 * Wraps the useQuerySignal hook to return a signal that subscribes to a graphql query and updates the signal
 * on an interval.
 */
export function usePollingQuerySignal<T extends object>({
  query,
  variables,
  interval,
}: { query: TypedDocumentNode<T, object>; variables?: any; interval: number }) {
  const { signal$, reexecuteQuery } = useUrqlQuerySignal(
    query,
    variables,
  );

  useEffect(() => {
    const id = setInterval(() => {
      reexecuteQuery({ requestPolicy: "network-only" });
    }, interval);

    return () => clearInterval(id);
  }, [interval]);

  return { signal$, reexecuteQuery };
}
