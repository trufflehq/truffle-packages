export default {
  name: "@truffle/shared-contexts",
  // don't bump major version. we want everyone importing the same file here
  // so they don't have duplicated contexts. imports are with ^1.0.0
  version: "1.0.0",
  apiUrl: "https://mycelium.truffle.vip/graphql",
  // apiUrl: "https://mycelium.staging.bio/graphql",
  requestedPermissions: [],
  installActionRel: {},
};
