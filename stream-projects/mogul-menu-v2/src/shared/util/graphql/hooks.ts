import { signal, useEffect, useQuery } from "../../../deps.ts";
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

export function useUrqlQuerySignal(query: any, variables?: any) {
  // TODO: implement
  return {
    signal$: signal({}),
    reexecuteQuery: (opts?: any) => {},
  };
}

export function useSubscriptionSignal() {
  return {
    signal$: signal({}),
    reexecuteQuery: (opts?: any) => {},
  };
}

export function useQuerySignal(query: any, variables?: any, args?: any) {
  return signal({});
}

export function usePollingQuerySignal(opts: any) {
  return {
    signal$: signal({}),
    reexecuteQuery: (opts?: any) => {},
  };
}
