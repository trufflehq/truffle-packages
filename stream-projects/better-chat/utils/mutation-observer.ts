import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { GLOBAL_JUMPER_MESSAGES } from "https://tfl.dev/@truffle/utils@~0.0.22/embed/mod.ts";
import { _clearCache } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";

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
import { OrgUserWithExtras } from "./types.ts";
import { getMeOrgUser } from "./org-user.ts";

const PUBLIC_CACHE_BASE_URL = "https://v2.truffle.vip/gateway/users/v2/c";
// const PUBLIC_CACHE_BASE_URL = 'https://truffle-tv-staging.truffle-tv.workers.dev/gateway/users/v2/c'
// const PUBLIC_CACHE_BASE_URL = 'http://localhost:3000/gateway/users/v2/c'

async function getYoutubeChannelActiveChattersByChannelId(channelId) {
  const res = await fetch(`${PUBLIC_CACHE_BASE_URL}/${channelId}`);
  return res.json();
}

export async function listen() {
  // user should be logged in via cookie from the creator site domain (eg new.ludwig.social)
  // but if/when they login via yotuube oauth button, we need to invalidate and login via cookie again
  jumper.call("comms.onMessage", (message: string) => {
    const shouldUpdateOrgUser = [
      GLOBAL_JUMPER_MESSAGES.ACCESS_TOKEN_UPDATED,
      GLOBAL_JUMPER_MESSAGES.INVALIDATE_USER,
      GLOBAL_JUMPER_MESSAGES.ACCESS_TOKEN_UPDATED,
    ].includes(message);
    const shouldResetClient =
      message === GLOBAL_JUMPER_MESSAGES.ACCESS_TOKEN_UPDATED;
    if (shouldResetClient) {
      // reset the api client w/ the updated user
      _clearCache();
    }
    if (shouldUpdateOrgUser) {
      setOrgUser();
    }
  });

  let orgUser: OrgUserWithExtras;
  const setOrgUser = async () => {
    orgUser = await getMeOrgUser();
  };
  await setOrgUser();

  const extensionContext = await jumper.call("context.getInfo");
  const youtubePageIdentifier = getYoutubePageIdentifier(
    extensionContext?.pageInfo,
  ) || {};

  // update active chatters every 5 seconds
  let activeChattersMap;
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
      try {
        const authorExternalChannelId = data?.authorExternalChannelId;
        const userInfo = activeChattersMap &&
          activeChattersMap.get(authorExternalChannelId);
        const isMe = authorExternalChannelId === orgUser?.connection?.sourceId;

        let bgColor, gradient, nameColor;
        if (isMe) {
          const activePowerups = orgUser?.activePowerupConnection?.nodes;
          const highlightMessageActivePowerup = activePowerups?.find((
            activePowerup,
          ) => activePowerup?.powerup?.slug === "chat-highlight-message");
          bgColor = highlightMessageActivePowerup?.data?.rgba;
          const gradientActivePowerup = activePowerups?.find((activePowerup) =>
            activePowerup?.powerup?.slug === "chat-gradient-username"
          );
          gradient = gradientActivePowerup?.data?.value;
          nameColor = orgUser?.keyValue?.value || userInfo?.c;
        } else if (userInfo) {
          bgColor = userInfo?.g;
          gradient = userInfo?.h;
          nameColor = userInfo?.c;
        }

        if (!nameColor) {
          const authorName = getYoutubeAuthorName(data);
          nameColor = getUsernameColor(authorName);
        }

        if (bgColor) setChatBgColor(id, bgColor);
        if (gradient) setChatUsernameGradient(id, gradient);
        if (nameColor) setChatNameColor(id, nameColor);
      } catch (err) {
        console.log("err", err);
      }
    });
  };

  jumper.call("layout.listenForElements", {
    listenElementLayoutConfigSteps: [
      { action: "querySelector", value: "#chatframe" },
      { action: "getIframeDocument" },
      { action: "querySelector", value: "#item-scroller #items" },
    ],
    observerConfig: { childList: true, subtree: true },
    targetQuerySelector: "yt-live-chat-text-message-renderer",
  }, onEmit);
}
