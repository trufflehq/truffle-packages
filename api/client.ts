import { Obs, op } from "https://tfl.dev/@truffle/utils@~0.0.2/obs/subject.ts";
import { useEffect } from "https://npm.tfl.dev/react";
import { pipe, take, toObservable } from "https://npm.tfl.dev/wonka@4.0.15";
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
// TODO: i think we can pull from urql/core instead of urql
import { createRequest, OperationContext } from "https://npm.tfl.dev/urql@2";
export { createRequest, gql } from "https://npm.tfl.dev/urql@2";

export const useMutation = _useMutation;
export const useQuery = _useQuery;
export const useSubscription = _useSubscription;
export const getClient = _getClient;

export function queryObservable(
  query: string,
  variables: Record<string, unknown>,
) {
  // might be able to get rid of toPromise since urql returns an observable (wonka, not rxjs)
  return Obs.from(getClient().query(query, variables).toPromise());
}

export function pollingQueryObservable(
  interval: number,
  query: string,
  variables?: Record<string, unknown>,
) {
  // have to convert to spec-compliant observable to work with RxJS
  // https://stackoverflow.com/questions/66309283/convert-ecmascript-observable-zen-observable-to-rxjs-observable/66380963#66380963
  const obs = new Observable((observer) => {
    pipe(
      // have to use `executeQuery` if we want to pass in `requestPolicy`;
      // setting `requestPolicy` to 'network-only' bypasses urql's cache
      getClient().executeQuery(
        createRequest(query, variables),
        { requestPolicy: "network-only" },
      ),
      take(1),
      toObservable,
    ).subscribe(observer);
  });

  return obs.pipe(op.poll(interval));
}

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
