export type AlertStatus = "ready" | "shown";
export type AlertType = "raid-stream" | "activity" | "watch-party";
export interface Alert {
  __typename: "Alert";
  id: string;
  userId: string;
  orgId: string;
  message: string;
  status: AlertStatus;
  type: string;
  sourceType: string; // the sourceType of the activity alert
  time: Date;
  data: Record<string, unknown>;
}
