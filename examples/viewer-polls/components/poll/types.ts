export type PollOption = {
  text: string;
  index: number;
  count: number;
  unique: number;
};

type PollVote = {
  optionIndex: number;
  count: number;
};

type Poll = {
  id: string;
  orgId: string;
  question: string;
  options: PollOption[];
  myVote: PollVote;
  time: Date;
  endTime: Date;
};

export type PollConnectionResponse = {
  pollConnection: {
    nodes: Poll[];
  };
};

type OwnedCollectible = {
  count: number;
};

type Collectible = {
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
