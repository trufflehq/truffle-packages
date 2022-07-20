export default {
  name: '@truffle/mashing-minigame',
  version: '0.2.7',
  apiUrl: 'https://mycelium.staging.bio/graphql',

  // This is used to specify the required permissions that the package has access to
  requestedPermissions: [
    // permission to update a key value
    {
      filters: { keyValue: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    },
    // permission to update an orgUserCounterType
    {
      filters: { orgUserCounterType: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    },
    // permission to update an orgUserCounterType
    {
      filters: { orgUserCounter: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    },
    // permission to update action
    {
      filters: { action: { isAll: true, rank: 0 } },
      action: "update",
      value: true,
    },
  ]
}
