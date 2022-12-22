import { gql, useSubscriptionSignal } from "../../../deps.ts";
import { ActivityConnection } from "../../../types/alert.types.ts";

export function useActivitySubscription$<ActivityType, SourceType extends string>(
  { status, type, limit }: { status?: string; type?: string; limit?: number },
) {
  const ACTIVITY_CONNECTION_SUBSCRIPTION = gql<
    { alertConnection: ActivityConnection<ActivityType, SourceType> }
  >`subscription AlertsReadyByType($status: String, $type: String, $limit: Int)
{
  alertConnection(
    input: {
      status: $status
      type: $type
    },
    first: $limit
  ) {
    nodes {
      id
      orgId
      userId
      message
      status
      type
      sourceType
      sourceId
      data
      time
      orgUser {
        name
      }
      activity {
        __typename
        ... on Poll {
          id
          orgId
          question
          counter {
            options {
              text
              index
              count
              unique
            }
          }
          myVote {
            optionIndex
            count
          }
          time
          endTime
          data
        }
        ... on Alert {
          id
          message
          type
          data
          time
          status
        }
      }
    }
  }
}`;

  const { signal$: activityAlertConnection$ } = useSubscriptionSignal(
    ACTIVITY_CONNECTION_SUBSCRIPTION,
    { limit, status, type },
  );

  return { activityAlertConnection$ };
}
