import { gql } from "../../deps.ts";

export const ALERT_CONNECTION_SUBSCRIPTION = gql`
  query {
    alertConnection(input: { type: "do-something" }) {
      nodes {
        id
        time
        data
      }
    }
  }
`;
