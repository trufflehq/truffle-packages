export default {
  name: "@truffle/utils",
  // if we bump minor version to 1, it might cause duplicate jumper imports.
  // we'll want to move jumper folder out into jumper-embed-layer package
  // that's always the same major version (1) and imported with ^
  // so we don't have multiple jumper instances running
  version: "0.0.35",
  apiUrl: "https://mycelium.truffle.vip/graphql",
  description: "Browser & Node utilities",
  //  apiUrl: "https://mycelium.staging.bio/graphql",
  // apiUrl: 'http://localhost:50420/graphql'
};
