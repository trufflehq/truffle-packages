import { gql } from "../../../deps.ts";

export const DELETE_POLL_MUTATION = gql`
mutation PollDeleteByIdMutation($id: ID!) {
  pollDeleteById(input: { id: $id }) {
    poll {
      id
    }
  }
}
`;
