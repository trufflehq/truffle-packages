import { Emote, EmoteProvider } from "./types.ts";

export const EMOTE_PROVIDER_NAME: Record<EmoteProvider, string> = {
  [EmoteProvider.Twitch]: "Twitch",
  [EmoteProvider.FFZ]: "FrankerFaceZ",
  [EmoteProvider.BTTV]: "BetterTTV",
  [EmoteProvider.Custom]: "Global",
  [EmoteProvider.Spore]: "Truffle",
  [EmoteProvider.SevenTV]: "7TV",
  [EmoteProvider.Youtube]: "YouTube",
  [EmoteProvider.Emotesly]: "Emotesly",
};

export function getEmoteUrl(emote?: Emote) {
  if (!emote) {
    return "";
  }
  if (emote.provider === EmoteProvider.Twitch) {
    return `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/static/dark/1.0`;
  } else if (emote.provider === EmoteProvider.FFZ) {
    return `https://cdn.frankerfacez.com/emote/${emote.id}/1`;
  } else if (emote.provider === EmoteProvider.BTTV) {
    return `https://cdn.betterttv.net/emote/${emote.id}/2x`;
  } else if (emote.provider === EmoteProvider.SevenTV) {
    return `https://cdn.7tv.app/emote/${emote.id}/1x`;
  } else if (emote.provider === EmoteProvider.Spore && emote?.ext) {
    return `https://cdn.bio/ugc/collectible/${emote.id}.tiny.${emote.ext}`;
  } else if (emote.provider === EmoteProvider.Custom) {
    return `https://v2.truffle.vip/emotes/${emote.id}`;
  } else if (emote.provider === EmoteProvider.Youtube) {
    return emote.src;
  } else if (emote.provider === EmoteProvider.Emotesly && emote?.cat) {
    return `https://cdn.jsdelivr.net/gh/bhavita/YTEmotesly/assets/${emote.cat}/${emote.id}.${emote.ext}`;
  } else {
    return undefined;
  }
}
