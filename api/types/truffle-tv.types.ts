export type EmbedSourceType =
  | "youtube"
  | "youtubeLive"
  | "youtubeVideo"
  | "twitch"
  | "url";

export type PageIdentifier = {
  sourceType: EmbedSourceType;
  sourceId: string;
};

export interface ExtensionInfo {
  version: string;
  pageInfo: PageIdentifier[];
  isExperimentalEnabled: boolean;
}
