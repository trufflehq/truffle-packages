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

export const WATCH_TIME_INCREMENT_MUTATION = gql`
  mutation ($secondsWatched: Int, $sourceType: String) {
    watchTimeIncrement(
      input: { secondsWatched: $secondsWatched, sourceType: $sourceType }
    ) {
      isUpdated
    }
  }
`;

export const WATCH_TIME_CLAIM_MUTATION = gql`
  mutation ($sourceType: String!) {
    watchTimeClaim(input: { sourceType: $sourceType }) {
      economyTransactions {
        amountId
        amountValue
      }
    }
  }
`;
