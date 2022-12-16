import { gql, makeOperation } from "https://npm.tfl.dev/urql/core@^3.0.0";
import { authExchange } from "https://npm.tfl.dev/@urql/exchange-auth@^1.0.0";
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import { getAccessToken, setAccessTokenCookie } from "./auth.ts";

export const TRUFFLE_ACCESS_TOKEN_KEY = "mogul-menu:accessToken";
const LOGIN_ANON_MUTATION = gql
  `mutation LoginAnon { userLoginAnon { accessToken } }`;

export function getAuthExchange() {
  return authExchange({
    addAuthToOperation: ({
      authState,
      operation,
    }) => {
      const context = globalContext.getStore();
      // the token isn't in the auth state, return the operation without changes
      // HACK: variables._skipAuth for domain query. ideally there's some way to bypass
      // auth via context instead of var
      if (
        (!authState || !authState.accessToken) &&
        !operation?.variables?._skipAuth
      ) {
        return operation;
      }

      // fetchOptions can be a function (See Client API) but you can simplify this based on usage
      const fetchOptions = typeof operation.context.fetchOptions === "function"
        ? operation.context.fetchOptions()
        : operation.context.fetchOptions || {};

      return makeOperation(
        operation.kind,
        operation,
        {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              "x-access-token": authState.accessToken,
              "x-org-id": context.orgId || "",
            },
          },
        },
      );
    },
    willAuthError: ({ authState }) => {
      if (!authState) return true;
      // e.g. check for expiration, existence of auth etc
      return false;
    },
    didAuthError: ({ error }) => {
      // check if the error was an auth error
      const hasAuthError = error.graphQLErrors.some(
        (e) => e.extensions?.code === 401,
      );

      if (hasAuthError) {
        console.log("Auth error, retrying");
        setAccessTokenCookie("");
      }

      return hasAuthError;
    },
    getAuth: async ({ authState, mutate }) => {
      let accessToken = await getAccessToken();

      // TODO: ideally we don't want to create an anon user during ssr because
      // the user may actually exist, but has 3rd party cookies disabled.
      // BUT we have to for now since sporocarp will break if we don't have
      // an accessToken
      if (!accessToken) {
        console.log("no user found, creating one");

        const response = await mutate(LOGIN_ANON_MUTATION);
        accessToken = response?.data?.userLoginAnon?.accessToken;
        setAccessTokenCookie(accessToken);
      }
      return { accessToken };
    },
  });
}
