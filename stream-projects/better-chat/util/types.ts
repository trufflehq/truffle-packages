type ActivePowerup = {
  slug: string;
};

export type ConnectionWithExtras = {
  orgUser: {
    activePowerupConnection: {
      totalCount: number;
      nodes: ActivePowerup[];
    };
  };
};
