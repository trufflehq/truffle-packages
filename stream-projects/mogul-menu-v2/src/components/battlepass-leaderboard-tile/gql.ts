import { gql } from "../../deps.ts";

export const BATTLEPASS_ORG_USER_COUNTER_TYPE_QUERY = gql`
  query OrgUserCounterTypeQuery {
    seasonPass {
      orgUserCounterTypeId
    }
  }
`;
