import { PageIdentifier, globalContext } from "../../deps.ts";
import { Emote, EmoteProvider } from "../emotes/mod.ts";
import { Badge } from "../badges/mod.ts";
import { ActivePowerupConnection, OrgUserWithChatInfo } from "./types.ts";

const BASE_API_URL = `https://v2.truffle.vip/gateway/emotes`;

export const getOrgUserName = (orgUser: OrgUserWithChatInfo) => orgUser?.name;

export const getOrgUserNameColor = (orgUser: OrgUserWithChatInfo) =>
  orgUser
    ?.keyValueConnection
    ?.nodes
    ?.find((kv) => kv.key === "nameColor")?.value;

export function getTruffleBadgesByActivePowerups(
  activePowerupConnection?: ActivePowerupConnection,
): Badge[] {
  return activePowerupConnection?.nodes
    ?.map((activePowerup) => ({
      tooltip: activePowerup.powerup.slug,
      src: activePowerup?.powerup?.componentRels?.[0]?.props?.imageSrc,
    }))
    .filter(({ src }) => src !== undefined) ?? [];
}

export function getYoutubeChannelId(pageIdentifiers?: PageIdentifier[]) {
  if (!pageIdentifiers?.length) return null;
  const channelIdentifier = pageIdentifiers.find((identifier) =>
    identifier.sourceType === "youtubeLive"
  );

  if (!channelIdentifier) {
    return null;
  }

  return channelIdentifier.sourceId;
}

// https://stackoverflow.com/questions/6903823/regex-for-youtube-id
const YOUTUBE_VIDEO_ID_REGEX =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;

export function getYoutubeVideoId(pageIdentifiers?: PageIdentifier[]) {
  if (!pageIdentifiers?.length) return null;
  const youtubeLiveIdentifier = pageIdentifiers.find((identifier) =>
    identifier.sourceType === "youtubeLive"
  );

  const urlIdentifier = pageIdentifiers.find((identifier) =>
    identifier.sourceType === "url"
  );

  if (!urlIdentifier || !youtubeLiveIdentifier) {
    return null;
  }

  const match = YOUTUBE_VIDEO_ID_REGEX.exec(urlIdentifier.sourceId);

  if (match) {
    return match[1];
  }

  return null;
}

export async function fetchTruffleEmotesByChannelId(channelId?: string | null) {
  const url = channelId ? `${BASE_API_URL}/c/${channelId}` : BASE_API_URL;
  const res = await fetch(url);
  const emotes: Emote[] = await res.json();

  return emotes;
}

export async function getTruffleChatEmoteMapByYoutubeChannelId(
  channelId?: string | null,
) {
  const emoteMap = new Map<string, Emote>();

  const emotes = await fetchTruffleEmotesByChannelId(channelId);

  emotes.forEach((emote) => {
    // check that the emote provider is supported
    if (emote.provider in EmoteProvider) {
      emoteMap.set(emote.name, emote);
    }
  });

  return emoteMap;
}


export function getOrgId() {
  const context = globalContext.getStore() || {};

  return context.orgId;
}