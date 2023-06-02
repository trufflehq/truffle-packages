export default {
  name: "@tim/screen-picker",
  // NOTE: for now, don't change version. updating embeds w/o changing version will still work.
  // changing version will cause reinstalls on creator sites to duplicate the embeds
  version: "0.5.33",
  apiUrl: "https://mycelium.truffle.vip/graphql",
  description: "Screen Picker",
  requestedPermissions: [],
  installActionRel: {},
  embeds: [
    {
      slug: "screen-picker-streamer-youtube-embed",
      contentPageType: "youtubeLive",
      defaultStyles: {
        "height": "900px",
        "width": "100%",
      },
      insertionMethod: "prepend",
      parentQuerySelector: "#above-the-fold",
      url: "https://screen-picker-embed.web.app/admin",
    },
    {
      slug: "screen-picker-viewer-youtube-embed",
      contentPageType: "youtubeLive",
      defaultStyles: {
        "height": "0",
        "width": "0",
        "display": "none",
      },
      insertionMethod: "prepend",
      parentQuerySelector: "#ytd-player > #container > #movie_player",
      url: "https://screen-picker-embed.web.app/viewer",
    },
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
        "height": "0",
        "width": "0",
        "display": "none",
      },
      "insertionMethod": "prepend",
      "parentQuerySelector": ".video-player__overlay",
      "url": "https://screen-picker-embed.web.app/viewer",
    },
  ],
};
