export const ACTIVITY_CONNECTION_SUBSCRIPTION =
  `subscription AlertsReadyByType($status: String, $type: String, $limit: Int)
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
