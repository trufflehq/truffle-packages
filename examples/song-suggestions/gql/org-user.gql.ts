import { gql } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

export const ORG_USER_QUERY = gql`
  query ($userId: ID!) {
    orgUser(input: { userId: $userId }) {
      name
      user {
        name
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
