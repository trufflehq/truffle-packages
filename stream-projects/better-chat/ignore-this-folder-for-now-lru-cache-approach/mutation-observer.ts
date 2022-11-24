import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { LayoutConfigStep } from "https://tfl.dev/@truffle/utils@~0.0.17/embed/types.ts";

import { getConnectionByYoutubeChannelId } from "./connection.ts";
import { ActivePowerupConnection, Badge } from "./types.ts";

const getIframeSteps = [
  { action: "querySelector", value: "#chatframe" },
  { action: "getIframeDocument" },
];

export function listen() {
  console.log("listen");

  // get logged in user from other frame?

  // get logged in user's activepowerups

  jumper.call("layout.listenForElements", {
    listenElementLayoutConfigSteps: [
      ...getIframeSteps,
      { action: "querySelector", value: "#item-scroller #items" },
    ],
    observerConfig: { childList: true, subtree: true },
    targetQuerySelector: "yt-live-chat-text-message-renderer",
    shouldCleanupMutatedElements: true,
  }, onEmit);
}

function onEmit(matches) {
  matches.forEach(async (match) => {
    console.log("match", match);

    const { id: elementId, data } = match;
    const authorId = data?.authorExternalChannelId;

    // check if in cache
    const connection = await getConnectionByYoutubeChannelId(authorId);

    let layoutConfigSteps = <LayoutConfigStep[]> [];

    if (connection) {
      // if (connection?.orgUser?.ownedCollectibleConnection?.nodes.length > 0) {
      //   layoutConfigSteps = layoutConfigSteps.concat(
      //     getAddEmotesSteps(elementId, connection?.orgUser?.ownedCollectibleConnection, innerText)
      //   )
      // }

      // TODO: figure out duplicate badge bug (happens whenever iframe reloads & new mut observer is created)
      // eg saving this file on dev (hot reload) should trigger it
      if (connection?.orgUser?.activePowerupConnection?.nodes.length > 0) {
        layoutConfigSteps = layoutConfigSteps.concat(
          getAddBadgesSteps(
            elementId,
            connection.orgUser.activePowerupConnection,
          ),
        );
      }
    }

    if (layoutConfigSteps.length > 0) {
      jumper.call("layout.applyLayoutConfigSteps", {
        layoutConfigSteps: layoutConfigSteps,
        mutatedElementId: elementId,
      });
    }
  });
}

// FIXME: if two mut obs are listening to same element, we get multiple truffle-ids
const getMessageBodyQuerySelectorStep = (
  truffleElementId: string,
  selector: string,
): LayoutConfigStep => {
  return {
    action: "querySelector",
    value: `[data-truffle-id="${truffleElementId}"] ${selector}`,
  };
};

const getBadgeSteps = (badge: Badge): LayoutConfigStep[] => [
  {
    action: "createImageSubject",
    value: JSON.stringify({
      src: badge.src,
      width: 16,
      height: 16,
    }),
  },
  { action: "prependSubject", value: null },
  { action: "useSubject" },
  {
    action: "setStyle",
    value: {
      "vertical-align": "middle",
      "margin-right": "4px",
    },
  },
];

const getAddBadgesSteps = (
  truffleElementId: string,
  activePowerupConnection: ActivePowerupConnection,
): LayoutConfigStep[] => {
  const badges = getBadges(activePowerupConnection);

  console.log("badges", badges);

  return [
    // useDocumentStep,
    ...getIframeSteps,
    getMessageBodyQuerySelectorStep(truffleElementId, "#author-name"),
    ...badges.map((badge) => getBadgeSteps(badge)).flat(),
  ];
};

function getBadges(activePowerupConnection: ActivePowerupConnection): Badge[] {
  return activePowerupConnection.nodes
    .filter((activePowerup) =>
      activePowerup?.powerup?.componentRels?.[0]?.props?.imageSrc
    )
    .map((activePowerup) => ({
      slug: activePowerup.powerup.slug,
      src: activePowerup.powerup.componentRels[0].props.imageSrc,
    }));
}
