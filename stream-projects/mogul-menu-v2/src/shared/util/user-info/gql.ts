import { gql } from "../../../deps.ts";
import { OrgUser } from "../../../types/mod.ts";

export const ORG_USER_QUERY = gql<{ orgUser: OrgUser }>`
  query {
    orgUser {
      id
      name
      userId
      orgId
      roleIds
      bio
      socials
      connectionConnection(input: { sourceTypes: ["youtube", "twitch"] }) {
        nodes {
          id
          sourceType
        }
      }
      roleConnection {
        nodes {
          id
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
    # (if re-enabling search for "seasonpassdisabled")
    # seasonPass {
    #   xp: orgUserCounter {
    #     count
    #   }
    # }
  }
`;
