import { TruffleGQlConnection } from "../deps.ts";
import { FileRel } from "./file.types.ts";

export type CollectibleType = "emote" | "redeemable" | "ticket";
export type CollectibleTargetType = "article";
export type CollectibleCategory =
  | "flair"
  | "chatMessageHighlight"
  | "chatUsernameGradient";
export type CollectibleRedeemType =
  | "powerup"
  | "discordRole"
  | "kingOfTheHill"
  | "alertCustomMessage"
  | "collectiblePack"
  | "recipe";

export interface CollectibleData<T> {
  category: CollectibleCategory;
  redeemType: CollectibleRedeemType;
  redeemButtonText: string;
  redeemData: T;
  description: string;
}

export interface OwnedCollectible<T> {
  collectible: Collectible<T>;
  userId: string;
  collectibleId: string;
  count: number;
}

export interface Collectible<T> {
  id: string;
  orgId: string;
  slug: string;
  name: string;
  fileRel: FileRel;
  type: CollectibleType;
  targetType: CollectibleTargetType;
  data: CollectibleData<T>;
  ownedCollectible: OwnedCollectible<T>;
}

export type CollectibleConnection = TruffleGQlConnection<
  Collectible<CollectibleRedeemData>
>;

interface ChatHighlightColor {
  name: string;
  rgba: string;
}

interface GradientColor {
  name: string;
  slug: string;
  value: string;
}

export interface ChatHighlightRedeemData extends ActivePowerupRedeemData {
  colors: ChatHighlightColor[];
}

export interface UsernameGradientRedeemData extends ActivePowerupRedeemData {
  colors: GradientColor[];
}

export interface ActivePowerupRedeemData {
  powerupId: string;
  durationSeconds: number;
  category?: CollectibleCategory;
  description?: string;
}

type CollectibleRedeemData =
  | ActivePowerupRedeemData
  | ChatHighlightRedeemData
  | UsernameGradientRedeemData;
