import { Obs } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import globalContext from 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'

import { useMutation as _useMutation, useQuery as _useQuery } from "./urql-mods/index.ts";
import { getClient as _getClient, makeClient } from './urql-client.ts'

// NOTE: want to keep the exports minimal so we don't have to always support all of urql
export { gql } from 'https://npm.tfl.dev/urql@2'

export const useMutation = _useMutation
export const useQuery = _useQuery
export const getClient = _getClient

export function queryObservable (query, variables) {
  // might be able to get rid of toPromise since urql returns an observable (wonka, not rxjs)
  return Obs.from(getClient().query(query, variables).toPromise())
}

export function mutation (query, variables) {
  return getClient().mutation(query, variables).toPromise()
}

// private method for now, potentially don't want to support this forever
export function _clearCache () {
  const context = globalContext.getStore();
  context.graphqlClient = makeClient()
}
