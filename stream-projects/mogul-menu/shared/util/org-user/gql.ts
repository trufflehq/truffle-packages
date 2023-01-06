import { gql } from "../../../deps.ts";
export const SAVE_ORG_USER_SETTINGS_MUTATION = gql`
  mutation ($orgUserId: ID, $username: String, $nameColor: String, $userId: String) {
    orgUserUpsert(input: { id: $orgUserId, name: $username }) {
      orgUser {
        id
      }
    }

    keyValueUpsert(
      input: {
        sourceType: "user"
        sourceId: $userId
        key: "nameColor"
        value: $nameColor
      }
    ) {
      keyValue {
        key
        value
      }
    }
  }
`;

export const ORG_USER_CHAT_SETTINGS_QUERY = gql`
  query {
    orgUser {
      id
      name
      userId
      orgId
      keyValue(input: { key: "nameColor" }) {
        key
        value
      }
      user {
        id
      }
    }
  }
`;
