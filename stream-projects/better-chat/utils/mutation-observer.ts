import {
  setChatBgColor,
  setChatNameColor,
  setChatUsernameGradient,
} from "./jumper.ts";

// PROD
const PUBLIC_CACHE_BASE_URL = "https://v2.truffle.vip/gateway/users/v2/c";

// STAGING
// const PUBLIC_CACHE_BASE_URL = 'https://truffle-tv-staging.truffle-tv.workers.dev/gateway/users/v2/c'

// DEV
// const PUBLIC_CACHE_BASE_URL = 'http://localhost:3000/gateway/users/v2/c'

const CHAT_FRAME_ID = "#chatframe";

const MESSAGE = {
  INVALIDATE_USER: "user.invalidate",
};
function getYoutubeChannelActiveChattersByChannelId(channelId) {
  return fetch(`${PUBLIC_CACHE_BASE_URL}/${channelId}`);
}

// user should be logged in via cookie from the creator site domain (eg new.ludwig.social)
// but if/when they login via yotuube oauth button, we need to invalidate and login via cookie again
jumper.call("comms.onMessage", (message: string) => {
  if (message === GLOBAL_JUMPER_MESSAGES.INVALIDATE_USER) {
    // invalidateYoutubeConnectionFn();
    refetchOrgUserConnections({ requestPolicy: "network-only" });
  } else if (message === GLOBAL_JUMPER_MESSAGES.ACCESS_TOKEN_UPDATED) {
    // reset the api client w/ the updated user and refetch user/channel points info
    _clearCache();
    refetchOrgUserConnections({ requestPolicy: "network-only" });
    reexecuteChannelPointsQuery({ requestPolicy: "network-only" });
  }
});

const extensionContext = await jumper.call("context.getInfo");
const youtubePageIdentifier = getYoutubePageIdentifier(
  extensionContext?.pageInfo,
);
// FIXME: refresh every 5 seconds
const activeChatters = await getYoutubeChannelActiveChattersByChannelId(
  youtubePageIdentifier.sourceId,
);
const activeChattersMap = new Map(activeChatters);

const orgUserActivePowerupsObs =
  ytConnection?.orgUser?.activePowerupConnection?.nodes || [];
const orgUserKeyValuesObs = ytConnection?.orgUser?.keyValueConnection?.nodes ||
  [];

const onEmit = (matches) => {
  matches.forEach(({ id, data, innerText, styles }) => {
    const authorExternalChannelId = data?.authorExternalChannelId;
    const userInfo = activeChatters &&
      activeChatters.get(authorExternalChannelId);
    const isMe = authorExternalChannelId === mogulTvUser?.sub;
    let color, gradient, nameColor;
    if (isMe) {
      color = orgUserActivePowerups?.find((activePowerup) =>
        activePowerup?.powerup?.slug === "chat-highlight-message"
      )?.data?.rgba;
      gradient = orgUserActivePowerups?.find((activePowerup) =>
        activePowerup?.powerup?.slug === "chat-gradient-username"
      )?.data?.value;
      nameColor = orgUserKeyValues?.find((kv) =>
        kv?.key === "nameColor"
      )?.value || userInfo?.c;
    } else if (userInfo) {
      color = userInfo?.g;
      gradient = userInfo?.h;
      nameColor = userInfo?.c;
    }

    if (!nameColor) {
      const authorName = getYoutubeAuthorName(data);
      nameColor = getUsernameColor(authorName);
    }

    if (color) setChatBgColor(id, color);
    if (gradient) setChatUsernameGradient(id, gradient);
    if (nameColor) setChatNameColor(id, nameColor);
  });
};

jumper.call("layout.listenForElements", {
  listenElementLayoutConfigSteps: [
    { action: "querySelector", value: CHAT_FRAME_ID },
    { action: "getIframeDocument" },
    { action: "querySelector", value: "#item-scroller #items" },
  ],
  observerConfig: { childList: true, subtree: true },
  targetQuerySelector: "yt-live-chat-text-message-renderer",
}, onEmit);
