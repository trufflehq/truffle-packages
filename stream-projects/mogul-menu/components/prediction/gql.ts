import { gql } from "../../deps.ts";
import { ChannelPoints, Poll, PollConnection } from "../../types/mod.ts";

const POLL_WITH_VOTES_FRAGMENT = `fragment PollWithVotes on Poll {
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
}`;

export const ACTIVE_POLL_QUERY = gql`
query ActivePredictionPoll {
  pollConnection(first: 1, input: { type: prediction }) {
    nodes {
      ...PollWithVotes
    }
  }
} ${POLL_WITH_VOTES_FRAGMENT}
`;

export const POLL_CONNECTION_SUBSCRIPTION = gql<{ pollConnection: PollConnection }>`
subscription ActivePredictionPoll {
  pollConnection(first: 1, input: { type: prediction }) {
    nodes {
      ...PollWithVotes
    }
  }
} ${POLL_WITH_VOTES_FRAGMENT}
`;

export const POLL_SUBSCRIPTION = gql<{ poll: Poll }>`
subscription PredictionPoll($id: ID!) {
  poll(input: { id: $id }) {
    ...PollWithVotes
  }
} ${POLL_WITH_VOTES_FRAGMENT}`;

export const VOTE_MUTATION = gql`
mutation PollVote($additionalData: JSON!, $voteCount: Float!) {
  economyTransactionCreateLegacy(
    input: {
      economyTriggerSlug: "prediction-vote"
      additionalData: $additionalData
      amountValue: $voteCount
    }
  ) {
    economyTransaction {
      id
    }
  }
}
`;

export const CHANNEL_POINTS_QUERY = gql<{ channelPoints: { orgUserCounter: ChannelPoints } }>`
  query ChannelPointsQuery {
    channelPoints: orgUserCounterType(input: { slug: "channel-points" }) {
      orgUserCounter {
        count
      }
    }
  }
`;

export const REFUND_PREDICTION_MUTATION = gql`
mutation PredictionRefundByIdMutation($id: ID) {
  pollChooseWinningOptionIndexById(input: { id: $id, isRefund: true }) {
    isWinnerSelected
  }
}
`;

export const CHOOSE_PREDICTION_WINNER_MUTATION = gql`
mutation PredictionChooseWinnerByIdMutation($id: ID, $winningOptionIndex: Int) {
  pollChooseWinningOptionIndexById(input: { id: $id, winningOptionIndex: $winningOptionIndex }) {
    isWinnerSelected
  }
}
`;

export const END_PREDICTION_MUTATION = gql<{ pollUpsert: { poll: Poll } }>`
mutation EndPredictionByIdMutation($id: ID) {
  pollUpsert(input: { id: $id, durationSeconds: -1 }) {
    poll {
      ...PollWithVotes
    }
  }
} ${POLL_WITH_VOTES_FRAGMENT}
`;
