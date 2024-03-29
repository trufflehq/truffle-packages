import { TruffleGQlConnection } from "../../deps.ts";

export type ConnectionOrgUserWithChatInfoAndPowerups = {
  orgUser: OrgUserWithChatInfo
};

export interface OrgUserWithChatInfo {
  name: string;
  keyValueConnection: ChatKeyValueConnection;
  user: UserWithName;
  activePowerupConnection?: ActivePowerupConnection;
}

export type OrgUserWithChatInfoConnection = OrgUserWithChatInfo & {
  connectionConnection?: ConnectionConnection
};

export type ConnectionConnection = TruffleGQlConnection<Connection>;

export interface Connection {
  sourceType: string;
  sourceId: string;
}

export type UserWithName = {
  name: string;
};

export type ChatKeyValueConnection = TruffleGQlConnection<ChatKeyValue>;

export type ChatKeyValue = MonthsSubbedKeyValue | NameColorKeyValue | KeyValue;

export interface KeyValue {
  key: string;
  value: string;
}

export interface NameColorKeyValue {
  key: "nameColor";
  value: `#${string}`;
}

export interface MonthsSubbedKeyValue {
  key: "subbedMonths";
  value: `${number}`;
}

export type ActivePowerupConnection = TruffleGQlConnection<ActivePowerup>;

export interface ActivePowerup {
  id: string;
  userId: string;
  data: {
    rgba: string;
    value: string;
  };
  powerup: Powerup;
}

export interface Powerup {
  id: string;
  slug: string;
  componentRels: ComponentRel[];
}

export type ComponentRel = {
  props: Record<string, unknown> & {
    imageSrc: string;
  };
};
