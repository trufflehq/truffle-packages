export default {
  name: "@truffle/mogul-menu-v2",
  version: "4.0.0",
  apiUrl: "https://mycelium.truffle.vip/graphql",
  description: "Menu for channel points, predictions, and activities",
  requestedPermissions: [],
  installActionRel: {},
  embeds: [
    {
      "status": "published", // TODO: remove and update all orgs we prev installed on, once 4.3.0 is out
      "minTruffleVersion": "4.2.8",

      "iconUrl": "https://cdn.bio/assets/images/features/channel_points/icon.svg",
      "slug": "mogul-menu-youtube-embed",
      "contentPageType": "youtubeLive",
      "defaultStyles": {
        "height": "0",
        "width": "0",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": "#above-the-fold",
      "isLoginRequired": true,
      "windowProps": {
        "title": "Channel points & Predictions",
        "initialDimensions": { "x": 640, "y": 600 },
      },
      "url": "https://mogul-menu.truffle.vip",
    },
  ],
};
