import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";

import { getConnectionByYoutubeChannelId } from "./connection.ts";

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
    // TBD if we need this (not sure if yt reuses chat frame, i'm guessing not)
    // shouldCleanupMutatedElements: true,
  }, onEmit);
}

function onEmit(matches) {
  matches.forEach(async (match) => {
    console.log("match", match);

    const { id: elementId, data, innerText } = match;
    const authorId = data?.authorExternalChannelId;

    // check if in cache
    const connection = await getConnectionByYoutubeChannelId(authorId);

    console.log("ymo con", authorId, connection, data);

    let layoutConfigSteps = [];

    if (connection) {
      // if (connection?.orgUser?.ownedCollectibleConnection?.nodes.length > 0) {
      //   layoutConfigSteps = layoutConfigSteps.concat(
      //     getAddEmotesSteps(elementId, connection?.orgUser?.ownedCollectibleConnection, innerText)
      //   )
      // }

      if (connection?.orgUser?.activePowerupConnection?.nodes.length > 0) {
        console.log(
          "ymo steps",
          getAddBadgesSteps(
            elementId,
            connection.orgUser.activePowerupConnection,
          ),
        );

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

const appendSubjectStep = { action: "appendSubject", value: null };

const getMessageBodyQuerySelectorStep = (truffleElementId, selector) => {
  return {
    action: "querySelector",
    value: `[data-truffle-id="${truffleElementId}"] ${selector}`,
  };
};

const getBadgeStep = (badge) => ({
  action: "createImageSubject",
  value: JSON.stringify({
    src: badge.src,
    width: 16,
    height: 16,
    "vertical-align": "sub",
  }),
});

const getAddBadgesSteps = (truffleElementId, activePowerupConnection) => {
  const badges = getBadges(activePowerupConnection);

  console.log("badges", badges);

  return [
    // useDocumentStep,
    ...getIframeSteps,
    getMessageBodyQuerySelectorStep(truffleElementId, "#chat-badges"),
    ...badges.map((badge) => [
      getBadgeStep(badge),
      appendSubjectStep,
    ]).flat(),
  ];
};

function getBadges(activePowerupConnection) {
  return activePowerupConnection.nodes
    .filter((activePowerup) =>
      activePowerup?.powerup?.componentRels?.[0]?.props?.imageSrc
    )
    .map((activePowerup) => ({
      slug: activePowerup.powerup.slug,
      src: activePowerup.powerup.componentRels[0].props.imageSrc,
    }));
}
