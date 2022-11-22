export enum EmoteProvider {
  Twitch,
  FFZ,
  BTTV,
  Custom,
  Spore,
  SevenTV,
  Youtube,
  Emotesly,
}

export type Emote = {
  provider: EmoteProvider;
  id: string;
  name: string;
  ext?: string;
  bitIndex?: number;
  channelId?: string;
  cat?: string;
  src?: string;
};
