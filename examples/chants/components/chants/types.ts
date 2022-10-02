export interface MatchedMessage {
  id: string;
  existingMutatedElementId: string;
  hasMutated: null;
  mutationObserverId: string;
  data: Data;
  innerText: string;
  innerHtml: string;
  styles: Record<string, string>;
}

export interface Data {
  authorName: AuthorName;
  authorPhoto: AuthorPhoto;
  authorExternalChannelId: string;
  trackingParams: string;
  id: string;
  timestampUsec: string;
  message: Message;
  authorBadges: AuthorBadge[];
}

export interface AuthorBadge {
  liveChatAuthorBadgeRenderer: LiveChatAuthorBadgeRenderer;
}

export interface LiveChatAuthorBadgeRenderer {
  accessibility: Accessibility;
  tooltip: string;
  customThumbnail: CustomThumbnail;
}

export interface Accessibility {
  accessibilityData: AccessibilityData;
}

export interface AccessibilityData {
  label: string;
}

export interface CustomThumbnail {
  thumbnails: CustomThumbnailThumbnail[];
  accessibility: Accessibility;
}

export interface CustomThumbnailThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface AuthorName {
  simpleText: string;
}

export interface AuthorPhoto {
  thumbnails: CustomThumbnailThumbnail[];
}

export interface Message {
  runs: Run[];
}

export interface Run {
  emoji?: Emoji;
  text?: string;
}

export interface Emoji {
  emojiId: string;
  image: Image;
  isCustomEmoji: boolean;
  isSporeEmote: boolean;
  channelId: string;
  searchTerms: string[];
  shortcuts: string[];
}

export interface Image {
  thumbnails: ImageThumbnail[];
  accessibility: Accessibility;
}

export interface ImageThumbnail {
  url: string;
}
