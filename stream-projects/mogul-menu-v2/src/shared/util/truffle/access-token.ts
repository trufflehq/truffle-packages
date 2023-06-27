import { jumper, signal } from "../../../deps.ts";

export async function setAccessToken(
  accessToken: string,
  { orgId }: { orgId?: string } = {},
) {
  // set accessToken in highest possible storage we have, and notify anyone
  // listening for accessToken changes
  try {
    await Promise.all([
      jumper.call("user.setAccessToken", {
        // we'll eventually have different accessTokens per orgId
        accessToken,
      }),
      jumper.call("comms.postMessage", "user.accessTokenUpdated"),
      // end legacy
    ]);
  } catch {
    // ignore
  }
}

export function getAccessToken() {
  return "";
}

export function getAccessToken$() {
  return signal(getAccessToken());
}

export function onAccessTokenChange(callback: (accessToken: string) => void) {
  // TODO: implement
  return { unsubscribe() {} };
}
