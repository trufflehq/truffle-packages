export enum EmoteProvider {
  Twitch,
  FFZ,
  BTTV,
  Custom,
  Spore,
  SevenTV,
  Youtube,
}

export type Emote = {
  provider: EmoteProvider;
  id: string;
  name: string;
  ext?: string;
  bitIndex?: number;
  channelId?: string;
  src?: string;
};
