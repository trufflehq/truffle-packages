type PollOption = {
  text: string;
  index: number;
  unique: number;
};
type Poll = {
  id: string;
  orgId: string;
  question: string;
  options: PollOption[];
  time: Date;
  endTime: Date;
};

export type PollConnectionResponse = {
  pollConnection: {
    nodes: Poll[];
  };
};
