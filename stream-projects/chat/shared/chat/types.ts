import { Badge } from "../badges/mod.ts";
export type ChatMessageType = "text"; // status, superchat, etc.

export interface NormalizedChatMessage {
  id: string;
  type: ChatMessageType;
  richText: React.ReactNode; // string of text
  text: string;
  authorName: string;
  authorNameColor: string;
  badges: Badge[];
  isVerified: boolean;
}
