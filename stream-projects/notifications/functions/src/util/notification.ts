import { gql, graphqlReq } from "./graphql-client.ts";

const UPSERT_NOTIFICATION_JOB_MUTATION = gql`
  mutation ($input: NotificationJobUpsertInput) {
    notificationJobUpsert(input: $input) {
      notificationJob {
        id
        isScheduled
        scheduledDeliveryTime
        actualDeliveryTime
      }
    }
  }
`;

export interface NotificationJobUpsertInput {
  notificationTopicId?: string;
  notificationTopicPath?: string;
  content: {
    title: string;
    body: string;
    icon: string;
  };
}

export async function upsertNotificationJob(
  notificationJobUpsertInput: NotificationJobUpsertInput,
  accessToken: string,
  orgId: string
) {
  const resp = await graphqlReq(
    UPSERT_NOTIFICATION_JOB_MUTATION,
    {
      input: notificationJobUpsertInput,
    },
    {
      accessToken,
      orgId,
    }
  ).then((resp) => resp.json());

  if (resp?.errors?.length > 0) {
    throw resp.errors;
  }

  return resp?.data?.notificationJobUpsert;
}
