export const enum SocialMediaEmojis {
  Twitter = "<:twitter:844391392418856982>",
  YouTube = "<:youtube:994727661056311326>",
  TikTok = "<:tiktok:994727659806400553>",
  Twitch = "<:twitch:994727845739900998>",
}

export const SOCIAL_MEDIA_EMOJIS: Record<string, string> = {
  twitter: SocialMediaEmojis.Twitter,
  youtube: SocialMediaEmojis.YouTube,
  tiktok: SocialMediaEmojis.TikTok,
  twitch: SocialMediaEmojis.Twitch,
};

export const SOCIAL_MEDIA_LINKS: Record<string, string> = {
  twitter: "https://twitter.com/",
  tiktok: "https://www.tiktok.com/@",
  twitch: "https://www.twitch.tv/",
};
