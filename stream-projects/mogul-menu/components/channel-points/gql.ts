import { gql } from "../../deps.ts";

export const CHANNEL_POINTS_QUERY = gql`
  query ChannelPointsQuery {
    orgUserCounterType(input: { slug: "channel-points" }) {
      orgUserCounter {
        count
      }
    }
  }
`;
