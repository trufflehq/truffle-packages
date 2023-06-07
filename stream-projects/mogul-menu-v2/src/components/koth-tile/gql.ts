import { gql } from "../../deps.ts";
import { KothOrgConfig, KOTHOrgUser } from "../../types/mod.ts";

export const KOTH_USER_QUERY = gql<
  { orgUser: Required<KOTHOrgUser> },
  { userId: string }
>`
  query KOTHUserQuery($userId: ID!) {
    orgUser(input: { userId: $userId }) {
      name
      activePowerupConnection {
        nodes {
          powerup {
            componentRels {
              props
            }
          }
        }
      }
      user {
        id
        avatarImage {
          cdn
          prefix
          ext
          variations {
            postfix
            width
            height
          }
          aspectRatio
        }
      }
    }
  }
`;

export const KOTH_ORG_CONFIG_SUBSCRIPTION = gql<KothOrgConfig>`
  subscription KOTHOrgQuery {
    org {
      orgConfig {
        data
      }
    }
  }
`;
