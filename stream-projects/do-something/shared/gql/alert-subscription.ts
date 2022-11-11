import { gql } from "../../deps.ts";

export const ALERT_CONNECTION_SUBSCRIPTION = gql`
  subscription {
    alertConnection(input: { type: "do-something" }) {
      nodes {
        id
        time
        data
      }
    }
  }
`;
