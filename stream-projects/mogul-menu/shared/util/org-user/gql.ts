import { gql } from "../../../deps.ts";
import { OrgUser } from "../../../types/mod.ts";
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

export const ORG_USER_WITH_ROLES_QUERY = gql<{ orgUser: OrgUser }>`
  query {
    orgUser {
      id # req for cache categoryFn
      userId
      orgId
      roleIds
      name
      bio
      socials
      roleConnection {
        nodes {
          id # req for cache categoryFn
          name
          slug
          rank
          isSuperAdmin
          permissionConnection {
            nodes {
              filters
              action
              value
            }
          }
        }
      }
    }
  }
`;
