import { gql } from "../../../deps.ts";

export const ACTIVE_POWERUPS_QUERY = gql`
  query ActivePowerupsQuery {
    activePowerupConnection {
      nodes {
        id
        creationDate
        powerup {
          id
          name
          slug
          componentRels {
            props
          }
        }
      }
    }
  }
`;
