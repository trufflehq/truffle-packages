export default {
  name: "@tim/screen-picker",
  version: "0.5.32",
  apiUrl: "https://mycelium.truffle.vip/graphql",
  requestedPermissions: [],
  installActionRel: {},
  embeds: [
    {
      slug: "screen-picker-streamer-twitch-embed",
      "contentPageType": "twitch",
      "defaultStyles": {
        "height": "900px",
        "width": "100%",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": ".channel-info-content",
      "url": "https://screen-picker-embed.web.app/admin",
    },
    {
      slug: "screen-picker-viewer-twitch-embed",
      "contentPageType": "twitch",
      "defaultStyles": {
        "height": "300px",
        "width": "100%",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": ".channel-info-content",
      "url": "https://screen-picker-embed.web.app/viewer",
    },
  ],
};
