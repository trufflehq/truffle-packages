import { setCookie, globalContext } from '../../deps.ts'

export function setAccessToken(accessToken?: string) {
  if (accessToken) {
    setCookie("accessToken", accessToken);
  }
}

export function setGlobalStoreOrgId(orgId: string) {
  const context = globalContext.getStore() || {}

  globalContext.setGlobalValue({
    ...context,
    orgId
  });
}
