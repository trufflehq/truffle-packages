import { TruffleGQlConnection } from "../deps.ts";
import { Collectible } from "./collectible.types.ts";
export interface OwnedCollectible {
  id: string;
  userId: string;
  count: number;
  collectible: Collectible<any>;
}

export type OwnedCollectibleConnection = TruffleGQlConnection<OwnedCollectible>;
