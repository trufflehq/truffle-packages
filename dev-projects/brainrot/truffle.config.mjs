export default {
  name: "@cucumber-owl/brainrot",
  version: "0.5.30",
  apiUrl: "https://mycelium.truffle.vip/graphql",
  description: "The Ultimate Brainrotter",
  embeds: [
    {
      slug: "brainrot-twitch-embed",
      url: "https://brainrot-embed.netlify.app/",
      contentPageType: "twitch",
      parentQuerySelector: "body",
      defaultStyles: {},
    },
  ],
  requestedPermissions: [],
  installActionRel: {},
};
