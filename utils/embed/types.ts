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

export type EmbedSource = {
  sourceType: EmbedSourceType;
  sourceId: string;
};

export type ReplaceImageConfig = {
  string: string;
  image: {
    src: string;
    width: number;
    height: number;
  };
};

export type ImageConfig = {
  src: string;
  width?: string;
  height?: string;
  alt?: string;
  ariaLabel?: string;
};

export type AddStyleSheetConfig = {
  css: string;
  id?: string;
  class?: string;
};

export type LayoutConfigStep =
  | { action: "appendSubject" }
  | { action: "cleanupMutationsByMutatedElementId"; value: string }
  | { action: "getIframeDocument" }
  | { action: "insertSubjectBefore" }
  | { action: "insertSubjectAfter" }
  | { action: "querySelector"; value: string }
  | { action: "replaceStringsWithImages"; value: string | ReplaceImageConfig }
  | {
    action: "createReplacedStringsWithImagesSubject";
    value: string | ReplaceImageConfig;
  }
  | { action: "resetStyles" }
  | { action: "useDocument" }
  | { action: "replaceWithSubject" }
  | { action: "createImageSubject"; value: string | ImageConfig }
  | { action: "setStyle"; value: string | Record<string, string> }
  | { action: "setStyleSubject"; value: string | Record<string, string> }
  | { action: "useSubject" }
  | { action: "addStyleSheet"; value: AddStyleSheetConfig }
  | { action: "addClassNames"; value: string | string[] }
  | { action: "setId"; value: string };

export interface Embed {
  id: string;
  sourceType: EmbedSourceType;
  sourceId: string;
  orgId: string;
  slug: string;
  defaultLayoutConfigSteps: LayoutConfigStep[];
  iframeUrl: string;
}

export interface EmbedConnection {
  nodes: Embed[];
  totalCount: number;
}

export const CONNECTION_SOURCE_TYPES = ["youtube", "twitch"] as const;
export type ConnectionSourceType =
  | typeof CONNECTION_SOURCE_TYPES[number]
  | undefined;

export interface ExtensionInfo {
  version: string;
  pageInfo: PageIdentifier[];
  isExperimentalEnabled: boolean;
}
  