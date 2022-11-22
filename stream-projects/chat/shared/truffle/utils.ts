import { PageIdentifier } from "../../deps.ts";
import { Emote } from "../emotes/mod.ts";
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
) {
  return activePowerupConnection?.nodes
    ?.map((activePowerup) => ({
      name: activePowerup.powerup.slug,
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

export async function fetchTruffleEmotesByChannelId(channelId?: string | null) {
  const url = channelId ? `${BASE_API_URL}/c/${channelId}` : BASE_API_URL;
  const res = await fetch(url);
  const emotes: Emote[] = await res.json();

  return emotes;
}

export async function getTruffleChatEmoteMapByYoutubeChannelId(channelId?: string | null) {
  const emoteMap = new Map<string, Emote>();

  const emotes = await fetchTruffleEmotesByChannelId(channelId);

  emotes.forEach((emote) => {
    emoteMap.set(emote.name, emote);
  });

  return emoteMap;
}
