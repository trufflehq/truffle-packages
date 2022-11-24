type ComponentRel = {
  props: Record<string, any>;
};

type Powerup = {
  id: string;
  slug: string;
  jsx: string;
  componentRels: ComponentRel[];
};

type ActivePowerupData = {
  rgba: string;
  value: string;
};

type KeyValue = {
  key: string;
  value: string;
};

type Connection = {
  sourceType: string;
  sourceId: string;
};

type ActivePowerup = {
  data: ActivePowerupData;
  powerup: Powerup;
};

type ActivePowerupConnection = {
  totalCount: number;
  nodes: ActivePowerup[];
};

export type OrgUserWithExtras = {
  connection: Connection;
  activePowerupConnection: ActivePowerupConnection;
  keyValue: KeyValue;
};

export type Badge = {
  slug: string;
  src: string;
};
