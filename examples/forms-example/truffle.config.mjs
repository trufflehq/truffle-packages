export default {
  name: "@truffle/forms-example",
  version: "0.6.19",
  apiUrl: "https://mycelium.staging.bio/graphql",
  requestedPermissions: [
    {
      filters: { form: { isAll: true, rank: 0 } },
      action: "create",
      value: true,
    },
  ],
  // we need to create the initial form when installing this package
  installActionRel: {
    actionPath: "@truffle/core@latest/_Action/graphql",
    runtimeData: {
      query: `
      mutation FormUpsert($input: FormUpsertInput!) {
        formUpsert(input: $input) {
          form {
            id
            name
            slug
          }
        }
      }`,
      variables: {
        input: {
          name: "My Form",
        },
      },
    },
  },
};
