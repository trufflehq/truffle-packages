import {
  getCookie,
  setCookie,
} from "https://tfl.dev/@truffle/utils@~0.0.2/cookie/cookie.ts";
import { _clearCache } from "./client.ts";
import { default as globalContext } from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";

const ACCESS_TOKEN_COOKIE = "accessToken";

export function getAccessToken(): string {
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function setAccessToken(accessToken?: string) {
  setCookie(ACCESS_TOKEN_COOKIE, accessToken, {});
}

export function setOrgId(orgId: string) {
  const context = globalContext.getStore() || {};

  globalContext.setGlobalValue({
    ...context,
    orgId,
  });
}

// private method for now, potentially don't want to support this forever (see _clearCache)
export function _setAccessTokenAndClear(accessToken?: string) {
  _clearCache();
  setAccessToken(accessToken);
}
