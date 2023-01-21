import { cacheExchange, Client, ClientOptions, dedupExchange, fetchExchange, makeOperation } from "@urql/core";
import { authExchange } from "@urql/exchange-auth";
import { DEFAULT_MYCELIUM_API_URL } from "../constants";
import { getAccessToken } from "../user/access-token";

export interface MyceliumClientOptions {
  url: string;
  userAccessToken?: string;
  orgId?: string;
  urqlOptions?: ClientOptions
}

interface AuthState {
  userAccessToken?: string;
  orgId?: string;
}

export function createMyceliumClient(options: MyceliumClientOptions = {
  url: DEFAULT_MYCELIUM_API_URL
}) {

  return new Client({
    url: options.url,
    exchanges: [
      dedupExchange,
      cacheExchange,
      // the authExchange call follows the docs:
      // https://formidable.com/open-source/urql/docs/advanced/authentication/
      authExchange({
        async getAuth({ authState }) {
          const _authState = authState as AuthState | undefined;
          if (!_authState?.userAccessToken) {
            const userAccessToken = options.userAccessToken || await getAccessToken();
            return { userAccessToken }
          }

          return authState
        },
        addAuthToOperation({ authState, operation }) {
          const _authState = authState as AuthState;

          const fetchOptions =
          typeof operation.context.fetchOptions === 'function'
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {};

          const authHeaders: Record<string, any> = {}

          // I am defining headers this way so that we can
          // still make successful requests to the API
          // even if we're not authenticated;
          // mycelium can handle requests without auth headers,
          // but if the headers are present with invalid values,
          // it will throw errors
          if (_authState.userAccessToken) {
            authHeaders['x-access-token'] = _authState.userAccessToken;
          }

          if (_authState.orgId) {
            authHeaders['x-org-id'] = _authState.orgId;
          }

          return makeOperation(operation.kind, operation, {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                ...authHeaders,
              },
            },
          });
        },
        didAuthError({ error }) {
          // check if the error was an auth error
          const hasAuthError = error?.graphQLErrors?.some(
            (e) => e.extensions?.code === 401,
          );
          return hasAuthError;
        },
        willAuthError() {
          return false;
        },

      }),
      fetchExchange,
    ],
    ...options.urqlOptions
  })
}