import { makeOperation, gql } from 'https://npm.tfl.dev/urql@2?deps=react@18&dev'
import { authExchange } from 'https://npm.tfl.dev/@urql/exchange-auth@0?dev'
import globalContext from 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'
import { getCookie } from 'https://tfl.dev/@truffle/utils@0.0.1/cookie/cookie.js'

const LOGIN_ANON_MUTATION = gql`mutation LoginAnon { userLoginAnon { accessToken } }`

const ACCESS_TOKEN_COOKIE = 'accessToken'

export function getAuthExchange () {
  return authExchange({
    addAuthToOperation: ({
      authState,
      operation
    }) => {
      const context = globalContext.getStore()
      // the token isn't in the auth state, return the operation without changes
      // HACK: variables._skipAuth for domain query. ideally there's some way to bypass
      // auth via context instead of var
      if ((!authState || !authState.accessToken) && !operation?.variables?._skipAuth) {
        return operation
      }

      // fetchOptions can be a function (See Client API) but you can simplify this based on usage
      const fetchOptions =
        typeof operation.context.fetchOptions === 'function'
          ? operation.context.fetchOptions()
          : operation.context.fetchOptions || {}

      return makeOperation(
        operation.kind,
        operation,
        {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              'x-access-token': authState.accessToken,
              'x-org-id': context.orgId || ''
            }
          }
        }
      )
    },
    willAuthError: ({ authState }) => {
      if (!authState) return true
      // e.g. check for expiration, existence of auth etc
      return false
    },
    didAuthError: ({ error }) => {
      // check if the error was an auth error
      return error.graphQLErrors.some(
        e => e.extensions?.status === '401'
      )
    },
    getAuth: async ({ authState, mutate }) => {
      // try existing accessToken
      let accessToken = getCookie(ACCESS_TOKEN_COOKIE)
      if (!accessToken) {
        const response = await mutate(LOGIN_ANON_MUTATION)
        accessToken = response?.data?.userLoginAnon?.accessToken
      }
      return { accessToken }
    }
  })
}
