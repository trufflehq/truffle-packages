import { TruffleGQlConnection } from "../deps.ts";
import { Powerup } from "./powerup.types.ts";

export interface ActivePowerupData {
  rgba: string;
  value: string;
}

export interface ActivePowerup {
  id: string;
  userId: string;
  orgId: string;
  powerupId: string;
  sourceType: string;
  sourceId: string;
  data: ActivePowerupData;
  creationDate: string;
  powerup: Powerup;
}

export type ActivePowerupConnection = TruffleGQlConnection<ActivePowerup>;
