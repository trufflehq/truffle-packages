import { gql } from '../deps.ts'

export const POLL_CONNECTION_QUERY = gql`
query PollConnectionQuery ($input: PollConnectionInput, $first: Int, $after: String, $last: Int, $before: String) {
  pollConnection(input: $input, first: $first, after: $after, last: $last, before: $before) {
      pageInfo {
          endCursor
          hasNextPage
          startCursor
          hasPreviousPage
      }
      nodes {
          id
          orgId
          question
          options {
              text
              index
              count
              unique
          }
          myVote {
            optionIndex
            count
          }
          data
          endTime
          time
      }
  }
}
`;

export const POLL_QUERY = gql`
query PollQuery ($input: PollInput) {
  poll(input: $input) {
          id
          orgId
          question
          options {
              text
              index
              count
              unique
          }
          myVote {
            optionIndex
            count
          }
          endTime
          time
  }
}
`;

export const POLL_VOTE_MUTATION = gql`
mutation PollVote($input: PollVoteByIdInput) {
  pollVoteById(
    input: $input
  ) {
    hasVoted
  }
}
`;

export const POLL_UPSERT_MUTATION = gql`
mutation PollUpsert ($input: PollUpsertInput) {
  pollUpsert(input: $input) {
      poll {
          id
          question
          options {
            text
            index
          }
          endTime
      }
  }
}
`