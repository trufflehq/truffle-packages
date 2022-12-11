import { gql } from "../../deps.ts";

export const ECONOMY_ACTION_QUERY = gql`
  query ($economyTriggerId: ID!) {
    economyAction(input: { economyTriggerId: $economyTriggerId }) {
      id
      orgId
      name
      amountValue
      amountId
      data {
        redeemData
        cooldownSeconds
      }
    }
  }
`;
