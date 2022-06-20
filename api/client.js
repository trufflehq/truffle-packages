import { createClient, gql, defaultExchanges } from 'https://npm.tfl.dev/urql@2?deps=react@18&dev'
import { authExchange } from 'https://npm.tfl.dev/@urql/exchange-auth@0?dev'
import globalContext from 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'
import { getCookie } from 'https://tfl.dev/@truffle/utils@0.0.1/cookie/cookie.js'
import { Obs } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import config from 'https://tfl.dev/@truffle/utils@0.0.1/config/config.js'

import { getAuthExchange } from './auth-exchange.js'

export function getClient () {
  const context = globalContext.getStore()

  console.log('config', config)

  context.graphqlClient = context.graphqlClient || createClient({
    url: `${config.API_URL}/graphql`,
    exchanges: [
      getAuthExchange(),
      ...defaultExchanges
    ]
  })
  console.log('upd', `${config.API_URL}/graphql`)
  context.graphqlClient.url = `${config.API_URL}/graphql`

  return context.graphqlClient
}

export function queryObservable (query, variables) {
  return Obs.from(getClient().query(query, variables).toPromise())
}

// useQuery, useMutation, Provider
export * from 'https://npm.tfl.dev/urql@2?deps=react@18&dev'
