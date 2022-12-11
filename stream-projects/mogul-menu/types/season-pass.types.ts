import { TruffleGQlConnection } from "../deps.ts";
import { Collectible } from "./collectible.types.ts";
import { EconomyAction } from "./economy-action.types.ts";
import { OrgUserCounter } from "./org-user-counter.types.ts";

export interface SeasonPassLevelReward<T> {
  sourceType: string;
  sourceId: string;
  tierNum: number;
  description: string;
  amountValue: number;
  source: Collectible<T>;
}

export interface SeasonPassLevel {
  levelNum: number;
  minXp: number;
  rewards: SeasonPassLevelReward<any>[];
}

export interface SeasonPassProgressionChange {
  leveNum: number;
  rewards: SeasonPassLevelReward<any>[];
}

export interface SeasonPassProgression {
  id: string;
  orgId: string;
  tierNum: number;
  changesSinceLastViewed: SeasonPassProgressionChange[];
}

export interface SeasonPass {
  id: string;
  orgId: string;
  name: string;
  data: any;
  levels: SeasonPassLevel[];
  orgUserCounterTypeId: string;
  orgUserCounter: OrgUserCounter;
  xp: OrgUserCounter;
  startTime: string;
  endTime: string;
  daysRemaining: number;
  economyActionConnection: TruffleGQlConnection<EconomyAction>;
  seasonPassProgression: SeasonPassProgression;
}
