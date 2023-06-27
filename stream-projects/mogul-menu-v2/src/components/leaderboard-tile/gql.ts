import { gql } from "../../deps.ts";

export const LEADERBOARD_COUNTER_QUERY = gql`
  query LeaderboardQuery($orgUserCounterTypeId: ID!, $limit: Int) {
    orgUserCounterConnection(
      input: { orgUserCounterTypeId: $orgUserCounterTypeId }
      first: $limit
    ) {
      nodes {
        count
        orgUser {
          name
          user {
            id
            name
            avatarImage {
              cdn
              prefix
              ext
              variations {
                postfix
                width
                height
              }
              aspectRatio
            }
          }
        }
      }
    }
  }
`;
