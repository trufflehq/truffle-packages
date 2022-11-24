import { Badge } from "../badges/mod.ts";
export type ChatMessageType = "text"; // status, superchat, etc.

export interface NormalizedChatMessage {
  id: string;
  type: ChatMessageType;
  data: NormalizedChatMessageData;
}

type NormalizedChatMessageData = NormalizedChatTextMessageData; // & NormalizedChatStatusMessageData & NormalizedChatSuperChatMessageData etc.

export interface NormalizedChatTextMessageData {
  richText: React.ReactNode; // component that renders message markup
  text: string;
  authorName: string;
  authorId: string;
  authorNameColor: string;
  badges: Badge[];
  isVerified: boolean;
}
