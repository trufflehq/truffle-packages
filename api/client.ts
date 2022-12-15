import { useEffect } from "https://npm.tfl.dev/react";
import { pipe, take, toObservable } from "https://npm.tfl.dev/wonka@^6.0.0"";
import { setPackageContext } from "https://tfl.dev/@truffle/global-context@^1.0.0/package-context.ts";

import { Observable } from "https://npm.tfl.dev/rxjs?bundle";

import {
  useMutation as _useMutation,
  useQuery as _useQuery,
  UseQueryArgs,
  useSubscription as _useSubscription,
} from "./urql-mods/index.ts";
import { getClient as _getClient, makeClient } from "./urql-client.ts";

// NOTE: want to keep the exports minimal so we don't have to always support all of urql
import { createRequest, OperationContext } from "https://npm.tfl.dev/@urql/core@^3.0.0";
export { createRequest, gql } from "https://npm.tfl.dev/@urql/core@^3.0.0";

export const useMutation = _useMutation;
export const useQuery = _useQuery;
export const useSubscription = _useSubscription;
export const getClient = _getClient;

export function query(
  query: string,
  variables?: Record<string, unknown>,
  operationContext?: Partial<OperationContext>,
) {
  return getClient().query(query, variables, operationContext).toPromise();
}

export function mutation(query: string, variables: Record<string, unknown>) {
  return getClient().mutation(query, variables).toPromise();
}

export function usePollingQuery<V = object, D = any>(
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

// private method for now, potentially don't want to support this forever
export function _clearCache() {
  setPackageContext("@truffle/api@0", {
    client: makeClient(),
  });
}
