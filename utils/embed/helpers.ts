import { _setAccessTokenAndClear } from "https://tfl.dev/@truffle/api@~0.1.7/mod.ts";
import { CONNECTION_SOURCE_TYPES, PageIdentifier } from "./types.ts";
import { findFirst } from "../helpers/mod.ts";

export const TRUFFLE_ACCESS_TOKEN_KEY = "mogul-menu:accessToken";

export function getConnectionSourceType(pageIdentifiers: PageIdentifier[]) {
  const sourceTypes = pageIdentifiers.map(({ sourceType }) => sourceType);

  return findFirst(CONNECTION_SOURCE_TYPES, sourceTypes);
}
