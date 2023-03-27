import type { TransframeSourceApi } from "./types";

/**
 * Generates a random string of 32 characters
 */
export function generateId () {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function createProviderApi<Api extends TransframeSourceApi<unknown>>(api: Api) {
  return api
}
