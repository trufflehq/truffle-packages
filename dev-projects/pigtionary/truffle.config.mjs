export default {
  name: "@casperr/pigtionary",
  // NOTE: for now, don't change version. updating embeds w/o changing version will still work.
  // changing version will cause reinstalls on creator sites to duplicate the embeds
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
    {
      slug: "pigtionary-streamer-youtube-embed",
      "contentPageType": "youtubeLive",
      "defaultStyles": {
        "height": "900px",
        "width": "100%",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": "#above-the-fold",
      "url": "https://pigtionary-embed.netlify.app/streamer.html",
    },
    {
      slug: "pigtionary-viewer-youtube-embed",
      "contentPageType": "youtubeLive",
      "defaultStyles": {
        "height": "300px",
        "width": "100%",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": "#above-the-fold",
      "url": "https://pigtionary-embed.netlify.app/viewer.html",
    },
  ],
};
