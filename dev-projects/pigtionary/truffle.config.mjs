const iconUrl = "https://pigtionary-embed.netlify.app/images/icon.svg";
const streamerUrl = "https://pigtionary-embed.netlify.app/streamer.html";
const viewerUrl = "https://pigtionary-embed.netlify.app/viewer.html";

export default {
  name: "@casperr/pigtionary",
  // NOTE: for now, don't change version. updating embeds w/o changing version will still work.
  // changing version will cause reinstalls on creator sites to duplicate the embeds
  version: "0.5.30",
  apiUrl: "https://mycelium.truffle.vip/graphql",
  description: "Play Pigtionary with your viewers!",
  requestedPermissions: [],
  installActionRel: {},
  embeds: [
    {
      iconUrl,
      "slug": "pigtionary-streamer-twitch-embed",
      "contentPageType": "twitch",
      "defaultStyles": {
        "height": "900px",
        "width": "100%",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": ".channel-info-content",
      "url": streamerUrl,
    },
    {
      iconUrl,
      "slug": "pigtionary-viewer-twitch-embed",
      "contentPageType": "twitch",
      "defaultStyles": {
        "height": "300px",
        "width": "100%",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": ".channel-info-content",
      "windowProps": {
        "title": "Pigtionary",
        "initialDimensions": { "x": 880, "y": 360 },
      },
      "url": viewerUrl,
    },
    {
      iconUrl,
      "slug": "pigtionary-streamer-youtube-embed",
      "contentPageType": "youtubeLive",
      "defaultStyles": {
        "height": "900px",
        "width": "100%",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": "#above-the-fold",
      "url": streamerUrl,
    },
    {
      iconUrl,
      "slug": "pigtionary-viewer-youtube-embed",
      "contentPageType": "youtubeLive",
      "defaultStyles": {
        "height": "300px",
        "width": "100%",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": "#above-the-fold",
      "windowProps": {
        "title": "Pigtionary",
        "initialDimensions": { "x": 880, "y": 360 },
      },
      "url": viewerUrl,
    },
  ],
};
