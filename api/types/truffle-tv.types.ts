export type ExtensionMappingSourceType =
  | "youtube"
  | "youtubeLive"
  | "youtubeVideo"
  | "twitch"
  | "url";

export type PageIdentifier = {
  sourceType: ExtensionMappingSourceType;
  sourceId: string;
};

export interface ExtensionInfo {
  version: string;
  pageInfo: PageIdentifier[];
  isExperimentalEnabled: boolean;
}
