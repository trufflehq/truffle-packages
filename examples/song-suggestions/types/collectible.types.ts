export type OwnedCollectible = {
  count: number;
};

export type Collectible = {
  id: string;
  orgId: string;
  slug: string;
  name: string;
  type: string;
  targetType: string;
  data: {
    category: string;
    redeemType: string;
    description: string;
    redeemData: Record<string, unknown>;
  };
  ownedCollectible: OwnedCollectible;
};

export type CollectibleResponse = {
  collectible: Collectible;
};
