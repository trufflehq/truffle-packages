import { gql } from "../../deps.ts";

interface OrgUserKV {
  orgUser: {
    keyValue: {
      key: string;
      value: string;
    };
  };
}

export const USER_KV_QUERY = gql<OrgUserKV>`
  query GetUserKeyValue($key: String!) {
    orgUser {
      keyValue(input: { key: $key }) {
        key
        value
      }
    }
  }
`;

export const USER_KV_MUTATION = gql`
  mutation SetUserKeyValue($key: String!, $value: String!) {
    keyValueUpsert(input: {
      sourceType: "user",
      key: $key,
      value: $value
    }) {
      keyValue {
        key
        value
      }
    }
  }
`;
