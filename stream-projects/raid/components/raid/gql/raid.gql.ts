import { gql } from "../../../deps.ts";

export const RAID_QUERY = gql`
  query RaidQuery {
    alertConnection(input: { type: "raid-stream", status: "ready" }) {
      nodes {
        id
        data
      }
    }
  }
`;
