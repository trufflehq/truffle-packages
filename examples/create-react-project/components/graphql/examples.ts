import { gql } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";

export default {
  me: {
    title: "Get info about the current user",
    docsUrl:
      "https://truffle-labs.notion.site/User-4a5993776f7346f798098bc90bcaba64",
    resolver: {
      query: gql`query GetMe { me { id, name } }`,
      variables: {},
    },
    mutation: {
      query: gql`mutation UserUpsert($input: UserUpsertInput!) {
        userUpsert(input: $input) { user { id } }
      }`,
      variables: { input: { name: "Random name" } },
    },
  },
  "key-value": {
    title: "Get KeyValues for the currently logged-in user",
    docsUrl:
      "https://truffle-labs.notion.site/KeyValue-f823c4f97bbf4531988fc740a643630e",
    resolver: {
      query: gql`query GetOrgUserKeyValues($input: OrgUserInput) {
        orgUser(input: $input) {
          userId
          orgId
          keyValueConnection {
            nodes {
              key
              value
            }
          }
        }
      }`,
      variables: {},
    },
    mutation: {
      query: gql`mutation KeyValueUpsert($input: KeyValueUpsertInput!) {
        keyValueUpsert(input: $input) { keyValue { key, value, sourceType, sourceId } }
      }`,
      variables: {
        input: {
          key: "my-key",
          value: "Some cool value",
          sourceType: "user",
        },
      },
    },
  },
  "key-value-org": {
    title:
      "Get KeyValues for an org (will fail if you're not logged into user with correct perms)",
    docsUrl:
      "https://truffle-labs.notion.site/KeyValue-f823c4f97bbf4531988fc740a643630e",
    resolver: {
      query: gql`query GetOrgUserKeyValues($input: OrgInput) {
        org(input: $input) {
          keyValueConnection {
            nodes {
              key
              value
            }
          }
        }
      }`,
      variables: {},
    },
    mutation: {
      query: gql`mutation KeyValueUpsert($input: KeyValueUpsertInput!) {
        keyValueUpsert(input: $input) { keyValue { key, value, sourceType, sourceId } }
      }`,
      variables: {
        input: {
          key: "my-key",
          value: "Some cool org value",
          sourceType: "org",
        },
      },
    },
  },
};
