// these utils are great - we may want to move into a separate package if we find ourselves using often.
// @truffle/live-embed imports these

export function isYoutubeVideo(url: string) {
  const regex =
    /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|(https?:\/\/)?(?:www\.)?youtu\.be\/)([^&\n?#]+)/;
  return regex.test(url);
}

// credit: mantish @ https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
export function extractYoutubeId(url: string) {
  const regex =
    /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|(https?:\/\/)?(?:www\.)?youtu\.be\/)([^&\n?#]+)/;
  const id = url.match(regex);
  return id?.[2];
}

export function isYoutubeChannel(url: string) {
  const regex = /(https?:\/\/)?(www.)?youtube.com\/channel\/([^/]+)\/?$/;
  return regex.test(url);
}

export function extractYoutubeChannelId(url: string) {
  const regex = /(https?:\/\/)?(www.)?youtube.com\/channel\/([^/]+)\/?$/;
  const channelId = url.match(regex)?.[3];
  return channelId;
}

export function isTwitchVideo(url: string) {
  const regex = /(https:\/\/)?(www.)?twitch.tv\/videos\/?/;
  return regex.test(url);
}

export function extractTwitchVideoId(url: string) {
  const regex = /(https?:\/\/)?(www.)?twitch.tv\/videos\/([\d]+)\/?/;
  const videoId = url.match(regex)?.[3];
  return videoId;
}

export function isTwitchChannel(url: string) {
  const regex = /(https?:\/\/)?(www.)?twitch.tv\/[^/]+\/?$/;
  return regex.test(url);
}

export function extractTwitchChannelName(url: string) {
  const regex = /(https?:\/\/)?(www.)?twitch.tv\/([^/]+)\/?$/;
  const channelName = url.match(regex)?.[3];
  return channelName;
}

export function getTwitchParents() {
  const domains = ["twitch.tv", "www.youtube.com", location.hostname];
  return domains.reduce(
    (acc, domain, idx) =>
      `${acc}parent=${domain}${idx === domains.length - 1 ? "" : "&"}`,
    "",
  );
}

export function previewSrc(url: string) {
  if (isYoutubeChannel(url)) {
    return `https://www.youtube.com/embed/live_stream?channel=${
      extractYoutubeChannelId(
        url,
      )
    }`;
  }

  if (isYoutubeVideo(url)) {
    return `https://www.youtube.com/embed/${extractYoutubeId(url)}`;
  }

  if (isTwitchChannel(url)) {
    return `https://player.twitch.tv/?channel=${
      extractTwitchChannelName(
        url,
      )
    }&${getTwitchParents()}`;
  }

  if (isTwitchVideo(url)) {
    return `https://player.twitch.tv/?video=${
      extractTwitchVideoId(
        url,
      )
    }&${getTwitchParents()}`;
  }

  return null;
}
