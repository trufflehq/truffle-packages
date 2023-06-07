import { signal } from "../../../deps.ts";

export function setAccessToken(
  accessToken: string,
  { orgId }: { orgId?: string } = {},
) {
  // TODO: implement
}

export function getAccessToken() {
  return "";
}

export function getAccessToken$() {
  return signal(getAccessToken());
}

export function onAccessTokenChange(callback: (accessToken: string) => void) {
  // TODO: implement
}
