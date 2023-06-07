import { gql } from "../../deps.ts";

export const ACTIVE_POLL_QUERY = gql`
query PredictionPoll {
  pollConnection(first: 1, input: { type: prediction }) {
    nodes {
      id
      question
      counter {
        options {
          index
          text
          count
          unique
        }
      }
      data
      time
      endTime
      myVote {
        optionIndex
        count
      }
    }
  }
}
`;
