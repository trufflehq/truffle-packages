import { gql, query } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";
import { OrgUserWithExtras } from "./types.ts";

const ME_ORG_USER_QUERY = gql`
query MeOrgUserWithMutationObserverInfo {
  orgUser {
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

export async function getMeOrgUser(): Promise<OrgUserWithExtras> {
  const response = await query(ME_ORG_USER_QUERY, {}, {
    requestPolicy: "network-only",
  });
  if (response?.error) {
    console.error(response.error);
  }
  return response?.data?.orgUser;
}
