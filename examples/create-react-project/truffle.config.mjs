export default {
  name: "@truffle/create-react-project",
  version: "0.5.8",
  // apiUrl: "https://mycelium.truffle.vip/graphql",
  apiUrl: "https://mycelium.staging.bio/graphql",
  description: "Truffle project React template",
  // apiUrl: "http://localhost:50420/graphql",
  embeds: [
    // TODO: implement as part of deploy step
    // TODO: somehow make these only visible for dev mode until approved by us?
    {
      route: "/hidden-extension-mapping",
      sourceType: "url",
      sourceId: "https://www.youtube.com/watch?v=Xe5KJINZGRA",
      defaultLayoutConfigSteps: [
        {
          action: "querySelector",
          value: "body",
        },
        {
          action: "appendSubject",
        },
      ],
      status: "experimental",
    },
  ],
};
