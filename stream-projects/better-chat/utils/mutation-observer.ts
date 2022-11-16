import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { GLOBAL_JUMPER_MESSAGES } from "https://tfl.dev/@truffle/utils@~0.0.22/embed/mod.ts";

import {
  setChatBgColor,
  setChatNameColor,
  setChatUsernameGradient,
} from "./jumper.ts";
import {
  getUsernameColor,
  getYoutubeAuthorName,
  getYoutubePageIdentifier,
} from "./helpers.ts";
import { getMeOrgUser } from "./org-user.ts";

const PUBLIC_CACHE_BASE_URL = "https://v2.truffle.vip/gateway/users/v2/c";
// const PUBLIC_CACHE_BASE_URL = 'https://truffle-tv-staging.truffle-tv.workers.dev/gateway/users/v2/c'
// const PUBLIC_CACHE_BASE_URL = 'http://localhost:3000/gateway/users/v2/c'

function getYoutubeChannelActiveChattersByChannelId(channelId) {
  return fetch(`${PUBLIC_CACHE_BASE_URL}/${channelId}`);
}

// user should be logged in via cookie from the creator site domain (eg new.ludwig.social)
// but if/when they login via yotuube oauth button, we need to invalidate and login via cookie again
jumper.call("comms.onMessage", (message: string) => {
  const shouldUpdateOrgUser = [
    GLOBAL_JUMPER_MESSAGES.ACCESS_TOKEN_UPDATED,
    GLOBAL_JUMPER_MESSAGES.INVALIDATE_USER,
  ].includes(message);
  if (shouldUpdateOrgUser) {
    setOrgUser();
  }
});

let orgUser;
const setOrgUser = async () => {
  orgUser = await getMeOrgUser();
};
await setOrgUser();

const extensionContext = await jumper.call("context.getInfo");
const youtubePageIdentifier = getYoutubePageIdentifier(
  extensionContext?.pageInfo,
);

// update active chatters every 5 seconds
let activeChatters;
const setActiveChatters = async () => {
  activeChattersMap = new Map(
    await getYoutubeChannelActiveChattersByChannelId(
      youtubePageIdentifier.sourceId,
    ),
  );
};
setActiveChatters();
setInterval(setActiveChatters, 5000);

const onEmit = (matches) => {
  matches.forEach(({ id, data }) => {
    const authorExternalChannelId = data?.authorExternalChannelId;
    const userInfo = activeChatters &&
      activeChatters.get(authorExternalChannelId);
    const isMe = authorExternalChannelId === orgUser.connection.sourceId;
    let color, gradient, nameColor;
    if (isMe) {
      color = orgUser.activePowerupConnection.nodes?.find((activePowerup) =>
        activePowerup?.powerup?.slug === "chat-highlight-message"
      )?.data?.rgba;
      gradient = orgUser.activePowerupConnection.nodes?.find((activePowerup) =>
        activePowerup?.powerup?.slug === "chat-gradient-username"
      )?.data?.value;
      nameColor = orgUser.keyValue.value || userInfo?.c;
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
    { action: "querySelector", value: "#chat" },
    { action: "getIframeDocument" },
    { action: "querySelector", value: "#item-scroller #items" },
  ],
  observerConfig: { childList: true, subtree: true },
  targetQuerySelector: "yt-live-chat-text-message-renderer",
}, onEmit);
