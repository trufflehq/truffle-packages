import {
  Client,
  CombinedError,
  getClient,
  ObservableObject,
  onEnd,
  onPush,
  OperationContext,
  OperationResult,
  pipe,
  Source,
  subscribe,
  takeWhile,
  TypedDocumentNode,
  useCallback,
  useComputed,
  useEffect,
  useMemo,
  useObserve,
  useQuery,
  UseQueryState,
  useSubscription,
} from "./deps.ts";

import {
  computeNextState,
  hasDepsChanged,
  initialState,
} from "https://tfl.dev/@truffle/api@~0.1.11/urql-mods/state.ts";
import { getCacheForClient } from "https://tfl.dev/@truffle/api@~0.1.11/urql-mods/cache.ts";
import { useRequest } from "https://tfl.dev/@truffle/api@~0.1.11/urql-mods/useRequest.ts";

import { signal } from "./signal.ts";
import { useSignal } from "./hooks.ts";
import { UseQueryArgs } from "https://tfl.dev/@truffle/api@~0.1.11/urql-mods/useQuery.ts";

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

  signal$.set(result);

  return { signal$, reexecuteQuery };
}

/** @internal */
function apiSignal<T extends object & { error: CombinedError | undefined }>(
  initialValue: T | Promise<T>,
) {
  return signal<T>(initialValue) as ObservableObject<T>;
}

const isSuspense = (client: Client, context?: Partial<OperationContext>) =>
  client.suspense && (!context || context.suspense !== false);

let currentInit = false;

/*
 * This hook creates a signal that subscribes to a graphql query. Can access the value of the response from the `value`
 * observable of the signal and any errors on the `error` observable.
*/
export function useQuerySignal<Data = any, Variables = object>(
  query: TypedDocumentNode<Data, Variables>,
  variables?: Variables,
  args?: Omit<UseQueryArgs<Variables, Data>, "query" | "variables">,
) {
  const client = getClient();
  const cache = getCacheForClient(client);
  const suspense = isSuspense(client, args?.context);
  const request = useRequest<Data, Variables>(query, variables);

  const source = useMemo(() => {
    if (args?.pause) return null;

    const source = client.executeQuery(request, {
      requestPolicy: args?.requestPolicy,
      ...args?.context,
    });

    return suspense
      ? pipe(
        source,
        onPush((result) => {
          cache.set(request.key, result);
        }),
      )
      : source;
  }, [
    cache,
    client,
    request,
    suspense,
    args?.pause,
    args?.requestPolicy,
    args?.context,
  ]);

  const getSnapshot = useCallback(
    (
      source: Source<OperationResult<Data, Variables>> | null,
      suspense: boolean,
    ): Partial<UseQueryState<Data, Variables>> => {
      if (!source) return { fetching: false };

      let result = cache.get(request.key);
      if (!result) {
        let resolve: (value: unknown) => void;

        const subscription = pipe(
          source,
          takeWhile(() => (suspense && !resolve) || !result),
          subscribe((_result) => {
            result = _result;
            if (resolve) resolve(result);
          }),
        );

        if (result == null && suspense) {
          const promise = new Promise((_resolve) => {
            resolve = _resolve;
          });

          cache.set(request.key, promise);
          throw promise;
        } else {
          subscription.unsubscribe();
        }
      } else if (suspense && result != null && "then" in result) {
        throw result;
      }

      return (result as OperationResult<Data, Variables>) || { fetching: true };
    },
    [cache, request],
  );

  const deps = [
    client,
    request,
    args?.requestPolicy,
    args?.context,
    args?.pause,
  ] as const;

  const signal$ = useSignal(
    () => {
      currentInit = true;
      try {
        return [
          source,
          computeNextState(initialState, getSnapshot(source, suspense)),
          deps,
        ] as const;
      } finally {
        currentInit = false;
      }
    },
  );

  useEffect(() => {
    if (source !== signal$.get()[0] && hasDepsChanged(signal$[2].get(), deps)) {
      signal$.set((prev) =>
        [
          source,
          computeNextState(
            prev[1],
            getSnapshot(source, suspense),
          ),
          deps,
        ] as const
      );
    }
  }, [source]);

  useObserve(() => {
    const source = signal$.get()[0];
    const request = signal$[2][1].get();

    let hasResult = false;

    const updateResult = (result: Partial<UseQueryState<Data, Variables>>) => {
      hasResult = true;
      if (!currentInit) {
        signal$.set((state) => {
          const nextResult = computeNextState(state[1], result);
          return state[1] !== nextResult
            ? [state[0], nextResult, state[2]]
            : state;
        });
      }
    };

    if (source) {
      const subscription = pipe(
        source,
        onEnd(() => {
          updateResult({ fetching: false });
        }),
        subscribe(updateResult),
      );

      if (!hasResult) updateResult({ fetching: true });

      return () => {
        cache.dispose(request.key);
        subscription.unsubscribe();
      };
    } else {
      updateResult({ fetching: false });
    }
  });

  const currentResult$ = useComputed(() => signal$.get()[1]);
  return currentResult$;
}

export type TruffleQuerySignal<T> = ObservableObject<
  T & { error: CombinedError | undefined }
>;

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
  const signal$ = useSignal<UseQueryState<T, object>>(undefined!);

  const source = useCallback(() => useSubscription<T>({ query, variables }), [
    query,
    variables,
  ]);
  const [result, reexecuteQuery] = source();

  signal$.set(result);

  return { signal$, reexecuteQuery };
}
