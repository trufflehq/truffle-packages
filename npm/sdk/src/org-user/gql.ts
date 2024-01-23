import { gql } from '@urql/core';

export const ORG_USER_QUERY = gql`
  query SDKOrgUserQuery($id: ID, $userId: ID, $orgId: ID) {
    orgMember(input: { id: $id, userId: $userId, orgId: $orgId }) {
      id
      name

      roles {
        id
        slug
      }

      # TODO: refactor this into a role client object
      roleConnection {
        nodes {
          id
          slug
          name
          permissionConnection {
            nodes {
              id
              filters
              action
              value
            }
          }
        }
      }
      # TODO: refactor this into a powerup client object
      activePowerupConnection {
        nodes {
          powerup {
            id
            slug
            jsx
            componentRels {
              props
            }
          }
        }
      }
    }
  }
`;
