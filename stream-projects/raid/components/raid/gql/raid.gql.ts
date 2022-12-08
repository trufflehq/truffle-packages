import { gql } from "../../../deps.ts";

export const RAID_QUERY = gql`
  query RaidQuery {
    alertConnection(input: { types: ["raid-stream", "watch-party"], status: "ready" }) {
      nodes {
        id
        data
        time
      }
    }
  }
`;
