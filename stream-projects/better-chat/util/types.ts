type ComponentRel = {
  props: Record<string, any>;
};

export type Powerup = {
  id: string;
  slug: string;
  jsx: string;
  componentRels: ComponentRel[];
};

export interface ActivePowerup {
  powerup: Powerup;
}

export interface ActivePowerupConnection {
  totalCount: number;
  nodes: ActivePowerup[];
}

export type ConnectionWithExtras = {
  orgUser: {
    activePowerupConnection: ActivePowerupConnection;
  };
};

export type Badge = {
  slug: string;
  src: string;
};
