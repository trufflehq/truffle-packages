import {
  cacheExchange,
  Client,
  ClientOptions,
  dedupExchange,
  fetchExchange,
  makeOperation,
  subscriptionExchange,
} from "@urql/core";
import { authExchange } from "@urql/exchange-auth";
import { createClient as createWSClient } from "graphql-ws";
import { DEFAULT_MYCELIUM_API_URL } from "../constants";
import { getAccessToken } from "../user/access-token";

export interface ApiClientOptions {
  url?: string;
  userAccessToken?: string;
  orgId?: string;
  urqlOptions?: ClientOptions;
}

interface AuthState {
  userAccessToken?: string;
  orgId?: string;
}

export function createApiClient(options: ApiClientOptions = {}) {
  // TODO: default to mothertree. atm this sdk still relies on some resolvers that aren't in mothertree yet
  const url = options.url || DEFAULT_MYCELIUM_API_URL;
  let activeSocket: WebSocket
  let timeoutId: NodeJS.Timeout;
  const wsClient = createWSClient({
    // FIXME: .replace is hacky
    url: url.replace("http", "ws"),
    // TODO: pass in websocket lib on node for ssr
    // need to figure out smart way to import only for node - ideally normal import, not dynamic

    // basically want to retry until we're connected
    retryAttempts: 99999,
    retryWait: async (retries) => {
      // 0.5s, 1s, 1.5, 2s, ..., 5s (repeated)
      const delayMs = Math.min((retries + 1) * 400, 5000);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    },
    // always retry. otherwise it doesn't seem to retry if server is down
    shouldRetry: (/* errOrCloseEvent */) => true,
    keepAlive: 30000,
    on: {
      connected: (socket) => (activeSocket = socket as WebSocket),
      ping: (received) => {
        if (!received) // sent
          timeoutId = setTimeout(() => {
            if (activeSocket.readyState === WebSocket.OPEN)
              activeSocket.close(4408, 'Request Timeout');
          }, 5000); // wait 5 seconds for the pong and then close the connection
      },
      pong: (received) => {
        if (received) clearTimeout(timeoutId); // pong is received, clear connection close timeout
      },
    },
  });

  return new Client({
    url,
    exchanges: [
      dedupExchange,
      cacheExchange,
      // the authExchange call follows the docs:
      // https://formidable.com/open-source/urql/docs/advanced/authentication/
      authExchange({
        async getAuth({ authState }) {
          const _authState = (authState ?? {}) as AuthState;

          if (!_authState.userAccessToken) {
            _authState.userAccessToken = options.userAccessToken ||
              (await getAccessToken());
          }

          // if the orgId is passed in as an option, use that
          if (options.orgId) {
            _authState.orgId = options.orgId;
          } else {
            // otherwise, extract orgId from userAccessToken
            const tokenPayload = JSON.parse(
              atob(_authState.userAccessToken.split(".")[1]),
            );
            _authState.orgId = tokenPayload.orgId;
          }

          return _authState;
        },
        addAuthToOperation({ authState, operation }) {
          const _authState = authState as AuthState;

          const fetchOptions =
            typeof operation.context.fetchOptions === "function"
              ? operation.context.fetchOptions()
              : operation.context.fetchOptions || {};

          const authHeaders: Record<string, any> = {};

          // I am defining headers this way so that we can
          // still make successful requests to the API
          // even if we're not authenticated;
          // mycelium can handle requests without auth headers,
          // but if the headers are present with invalid values,
          // it will throw errors
          if (_authState.userAccessToken) {
            authHeaders["x-access-token"] = _authState.userAccessToken;
          }

          if (_authState.orgId) {
            authHeaders["x-org-id"] = _authState.orgId;
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
      subscriptionExchange({
        forwardSubscription(operation) {
          return {
            subscribe: (sink) => {
              const dispose = wsClient!.subscribe(operation, sink);
              return {
                unsubscribe: dispose,
              };
            },
          };
        },
      }),
    ],
    ...options.urqlOptions,
  });
}
