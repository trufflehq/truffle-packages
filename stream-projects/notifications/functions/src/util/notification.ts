import { gql, graphqlReq } from "./graphql-client.ts";

const UPSERT_NOTIFICATION_JOB_MUTATION = gql`
  mutation ($input: NotificationJobUpsertInput) {
    notificationJobUpsert(input: $input) {
      id
      isScheduled
      scheduledDeliveryTime
      actualDeliveryTime
    }
  }
`;

interface NotificationJobUpsertInput {
  packageId: string;
  notificationTopicSlug: string;
  content: {
    title: string;
    body: string;
    icon: string;
  };
}

export async function upsertNotificationJob(
  notificationJobUpsertInput: NotificationJobUpsertInput,
  apiKey: string
) {
  const resp = await graphqlReq(
    UPSERT_NOTIFICATION_JOB_MUTATION,
    {
      input: notificationJobUpsertInput,
    },
    {
      apiKey,
    }
  ).then((resp) => resp.json());

  if (resp?.errors?.length > 0) {
    throw resp.errors;
  }

  return resp?.data?.notificationJobUpsert;
}
