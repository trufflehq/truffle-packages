import { Obs, op } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import globalContext from 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'
import { useEffect } from 'https://npm.tfl.dev/react'
import { createRequest } from 'https://npm.tfl.dev/urql@2'
import { pipe, toObservable, take } from "https://npm.tfl.dev/wonka@4.0.15"

// PLEASE COMMENT: should we export this from https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js?
import { Observable } from 'https://npm.tfl.dev/rxjs?bundle'

import { useMutation as _useMutation, useQuery as _useQuery } from "./urql-mods/index.ts";
import { getClient as _getClient, makeClient } from './urql-client.ts'

// NOTE: want to keep the exports minimal so we don't have to always support all of urql
export { gql, createRequest } from 'https://npm.tfl.dev/urql@2'

export const useMutation = _useMutation
export const useQuery = _useQuery
export const getClient = _getClient

export function queryObservable (query, variables) {
  // might be able to get rid of toPromise since urql returns an observable (wonka, not rxjs)
  return Obs.from(getClient().query(query, variables).toPromise())
}

export function pollingQueryObservable (interval, query, variables) {
  // have to convert to spec-compliant observable to work with RxJS
  // https://stackoverflow.com/questions/66309283/convert-ecmascript-observable-zen-observable-to-rxjs-observable/66380963#66380963
  const obs = new Observable((observer) => {
    pipe(
      // have to use `executeQuery` if we want to pass in `requestPolicy`
      getClient().executeQuery(
        createRequest(query, variables),
        { requestPolicy: "network-only" }
      ),
      take(1),
      toObservable,
    ).subscribe(observer);
  })

  return obs.pipe(op.poll(interval))
}

export function mutation (query, variables) {
  return getClient().mutation(query, variables).toPromise()
}

export function usePollingQuery (interval, queryInput) {
  const [result, reexecuteQuery] = useQuery(queryInput)

  useEffect(() => {
    const intId = setInterval(() => {
      reexecuteQuery({ requestPolicy: 'network-only' });
    }, interval);

    return () => {
      clearInterval(intId)
    }
  }, [])

  return result
}

// private method for now, potentially don't want to support this forever
export function _clearCache () {
  const context = globalContext.getStore();
  context.graphqlClient = makeClient()
}
