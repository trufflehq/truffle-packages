import { gql, GQLResponse, graphqlReq } from "./graphql-client.ts";
import { User } from "../../../shared/types/user.ts";

const USER_QUERY = gql`
  query($id: ID!) {
    user(input: { id: $id }) {
      id
      name
      avatarImage {
        prefix
        cdn
        ext
        variations {
          height
          postfix
          width
        }
      }
    }
  }
`;

export async function getUserById(id: string, accessToken: string, orgId: string) {
  const resp =
    (await graphqlReq(USER_QUERY, { id }, { accessToken, orgId }).then((resp) =>
      resp.json()
    )) as GQLResponse<{ user: User }>;

  if (resp?.errors?.length > 0) {
    throw resp.errors;
  }

  return resp?.data?.user;
}
