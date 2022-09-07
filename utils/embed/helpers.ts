import jumper from "https://tfl.dev/@truffle/utils@0.0.3/jumper/jumper.ts";
import { _setAccessTokenAndClear } from "https://tfl.dev/@truffle/api@~0.1.7/mod.ts";
import { CONNECTION_SOURCE_TYPES, PageIdentifier } from "./types.ts";
import { findFirst } from "../helpers/mod.ts";

export const TRUFFLE_ACCESS_TOKEN_KEY = "mogul-menu:accessToken";

export function getConnectionSourceType(pageIdentifiers: PageIdentifier[]) {
  const sourceTypes = pageIdentifiers.map(({ sourceType }) => sourceType);

  return findFirst(CONNECTION_SOURCE_TYPES, sourceTypes);
}

export async function getTruffleTvAccessToken() {
  const accessToken = await jumper?.call("storage.get", {
    key: TRUFFLE_ACCESS_TOKEN_KEY,
  });

  return accessToken;
}

export async function loginFromExtension() {
  const accessToken = await getTruffleTvAccessToken();

  _setAccessTokenAndClear(accessToken);
}
