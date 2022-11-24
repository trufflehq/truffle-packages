import { gql, GQLResponse, graphqlReq } from "./graphql-client.ts";
import { Collectible } from "../../../shared/types/collectible.ts";

const COLLECTIBLE_QUERY = gql`
  query($path: String!) {
    collectible(input: { resourcePath: $path }) {
      id
      name
      fileRel {
        fileObj {
          src
        }
      }
    }
  }
`;

export async function getCollectibleByPath(path: string, accessToken: string, orgId: string) {
  const resp =
    (await graphqlReq(COLLECTIBLE_QUERY, { path }, { accessToken, orgId }).then((resp) =>
      resp.json()
    )) as GQLResponse<{ collectible: Collectible }>;

  if (resp?.errors?.length > 0) {
    throw resp.errors;
  }

  return resp?.data?.collectible;
}
