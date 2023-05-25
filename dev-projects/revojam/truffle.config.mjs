export default {
  name: "@alexswear/revojam",
  // NOTE: for now, don't change version. updating embeds w/o changing version will still work.
  // changing version will cause reinstalls on creator sites to duplicate the embeds
  version: "0.5.30",
  apiUrl: "https://mycelium.truffle.vip/graphql",
  description:
    "the ultimate music companion for livestreamers. collaborate with viewers on live playlists.",
  requestedPermissions: [],
  installActionRel: {},
  embeds: [
    {
      slug: "revojam-youtube-embed",
      contentPageType: "youtubeLive",
      defaultStyles: {
        "background-color": "#666",
        "border": "2px solid black",
        "border-radius": "3px",
        "box-shadow": "2px 3px black",
        "height": "85px",
        "margin-top": "3px",
        "transition": "height 300ms ease-in-out",
        "width": "100%",
      },
      insertionMethod: "prepend",
      parentQuerySelector: "#above-the-fold",
      url: "https://app.revojam.com/truffleConnect",
    },
    {
      slug: "revojam-twitch-embed",
      contentPageType: "twitch",
      defaultStyles: {
        "background-color": "#666",
        "border": "2px solid black",
        "border-radius": "3px",
        "box-shadow": "2px 3px black",
        "height": "85px",
        "margin-top": "3px",
        "transition": "height 300ms ease-in-out",
        "width": "100%",
      },
      insertionMethod: "prepend",
      parentQuerySelector: ".channel-info-content",
      url: "https://app.revojam.com/truffleConnect",
    },
  ],
};
