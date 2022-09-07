import { CONNECTION_SOURCE_TYPES, PageIdentifier } from "./types.ts";
import { findFirst } from '../helpers/mod.ts'

export function getConnectionSourceType(pageIdentifiers: PageIdentifier[]) {
  const sourceTypes = pageIdentifiers.map(({ sourceType }) => sourceType);

  return findFirst(CONNECTION_SOURCE_TYPES, sourceTypes);
}
