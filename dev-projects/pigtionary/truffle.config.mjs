export default {
  name: "@casperr/pigtionary",
  version: "0.5.30",
  apiUrl: "https://mycelium.truffle.vip/graphql",
  requestedPermissions: [],
  installActionRel: {},
  embeds: [
    {
      slug: "pigtionary-streamer-twitch-embed",
      "contentPageType": "twitch",
      "defaultStyles": {
        "height": "900px",
        "width": "100%",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": ".channel-info-content",
      "url": "https://pigtionary-embed.netlify.app/streamer.html",
    },
    {
      slug: "pigtionary-viewer-twitch-embed",
      "contentPageType": "twitch",
      "defaultStyles": {
        "height": "300px",
        "width": "100%",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": ".channel-info-content",
      "url": "https://pigtionary-embed.netlify.app/viewer.html",
    },
  ],
};
