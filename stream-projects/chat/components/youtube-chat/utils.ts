import { PageIdentifier } from '../../deps.ts'

export function getStringHash(str: string) {
  let hash = 0;
  if (str.length === 0) return 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export const DEFAULT_CHAT_COLORS = [
  "#ff0000",
  "#009000",
  "#b22222",
  "#ff7f50",
  "#9acd32",
  "#ff4500",
  "#2e8b57",
  "#daa520",
  "#d2691e",
  "#5f9ea0",
  "#1e90ff",
  "#ff69b4",
  "#00ff7f",
  "#a244f9",
];

export function getChannelId(pageIdentifiers?: PageIdentifier[]) {
  if(!pageIdentifiers?.length) return null;
  const channelIdentifier = pageIdentifiers.find((identifier) =>
    identifier.sourceType === "youtubeLive"
  );

  if (!channelIdentifier) {
    return null;
  }

  return channelIdentifier.sourceId;
}
