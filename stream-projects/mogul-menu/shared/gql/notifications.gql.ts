import { gql } from "../../deps.ts";

export const NOTIFICATION_TOPIC_QUERY = gql`
  query {
    notificationTopicConnection {
      nodes {
        id
        slug
        name
        description
        isSubscribed
      }
    }
  }
`;

export const UPSERT_NOTIFICATION_SUBSCRIPTION_MUTATION = gql`
  mutation($subscriptions: [NotificationSubscriptionUpsertInput]) {
    notificationSubscriptionsBatchUpsert(input: { subscriptions: $subscriptions }) {
      notificationSubscriptions {
        isSubscribed
      }
    }
  }
`;
