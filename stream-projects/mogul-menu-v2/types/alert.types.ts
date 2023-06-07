import { TruffleGQlConnection } from "../deps.ts";
import { OrgUser } from "./org-user.types.ts";

export type AlertStatus = "ready" | "shown";
export type AlertType = "raid-stream" | "activity" | "watch-party";

export interface Alert<
  SourceType extends string,
  AlertDataType = Record<string, any>,
> {
  __typename: "Alert";
  id: string;
  userId: string;
  orgId: string;
  message: string;
  status: AlertStatus;
  orgUser: Pick<OrgUser, "name">;
  type: AlertType;
  sourceType: SourceType; // the sourceType of the activity alert
  time: Date;
  data: AlertDataType;
}

export type RaidAlert = Alert<"raid-stream", {
  url?: string;
  title?: string;
  description?: string;
}>;

export type WatchPartyAlert = Alert<"watch-party", {
  url?: string;
  title?: string;
  description?: string;
}>;

export interface ActivityAlert<ActivityType, SourceType extends string>
  extends Alert<SourceType> {
  activity: ActivityType;
}

export type ActivityConnection<ActivityType, SourceType extends string> =
  TruffleGQlConnection<
    ActivityAlert<ActivityType, SourceType>
  >;
