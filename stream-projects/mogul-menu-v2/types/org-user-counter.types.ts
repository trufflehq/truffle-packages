import { TruffleGQlConnection } from "../deps.ts";
import { OrgUser } from "./org-user.types.ts";

export interface OrgUserCounter {
  count: number;
  orgUser: OrgUser;
}

export type ChannelPoints = {
  count: number;
};

export type OrgUserCounterConnection = TruffleGQlConnection<OrgUserCounter>;
