import { gql } from "../../deps.ts";

export const EVENT_TOPIC_QUERY = gql`
  query($resourcePath: String!) {
    eventTopic(input: {
      resourcePath: $resourcePath
    }) {
      id
    }
  }
`;
