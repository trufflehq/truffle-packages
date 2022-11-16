import { gql, query } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";

const ME_ORG_USER_QUERY = gql`
query MeOrgUserWithMutationObserverInfo ($input: ConnectionInput) {
  orgUser {
    # TODO: need to add mycelium resolver for this
    connection(input: { sourceType: "youtube" }) {
      sourceId
    }
    keyValue(input: { key: "nameColor" }) { value }
    activePowerupConnection {
      totalCount
      nodes {
        id
        userId
        data {
          rgba
          value
        }
        powerup {
          id
          slug
          componentRels {
            props
          }
        }
      }
    }
  }
}`;

export function getMeOrgUser() {
  return query(ME_ORG_USER_QUERY, {});
}
