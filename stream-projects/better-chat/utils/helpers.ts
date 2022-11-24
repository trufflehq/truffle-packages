export function getStringHash(str) {
  let hash = 0;
  if (str.length === 0) return 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

const colors = [
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

export function getUsernameColor(str: string): string {
  const hash = str ? getStringHash(str) : "base name";
  return colors[((hash % colors.length) + colors.length) % colors.length];
}

export function getYoutubeAuthorName(data): string {
  return data?.authorName?.simpleText;
}

export function isYoutubeSourceType(sourceType): boolean {
  return sourceType === "youtube" ||
    sourceType === "youtubeLive" ||
    sourceType === "youtubeVideo";
}

export function getYoutubePageIdentifier(pageInfoIdentifiers?) {
  return pageInfoIdentifiers?.find((identifier) =>
    isYoutubeSourceType(identifier.sourceType)
  );
}
