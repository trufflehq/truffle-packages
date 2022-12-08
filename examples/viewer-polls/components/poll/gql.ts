import { gql } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

export const ME_QUERY = gql`
  query {
    me {
      id
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
`;

export const PACKAGE_CONNECTION_QUERY = gql`
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

export const COLLECTIBLE_BY_SLUG_QUERY = gql`
query CollectibleQuery ($input: CollectibleInput!) {
    collectible(input: $input) {
       id
       orgId
       slug
       name
       type
       targetType
       data {
           category
           redeemType
           description
           redeemData
       }
       ownedCollectible {
        count
       }
    }
}
`;

export const OWNED_COLLECTIBLE_REDEEMED_MUTATION = gql`
mutation OwnedCollectibleRedeem ($input: OwnedCollectibleRedeemInput) {
    ownedCollectibleRedeem(input: $input) {
        redeemResponse
        redeemError
    }
}
`;
