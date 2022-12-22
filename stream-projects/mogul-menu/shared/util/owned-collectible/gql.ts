import { gql } from "../../../deps.ts";

export const OWNED_COLLECTIBLE_GET_ALL_BY_ME_QUERY = gql`
  query OwnedCollectibleGetAllByMe($orgId: ID) {
    # TODO: fix this hardcoded paging and possibly
    # convert this query to an "ownedCollectibleConnection"
    # query instead of "collectibleConnection" so that we're
    # not grabbing collectibles that the user doesn't own.
    ownedCollectibleConnection(input: { orgId: $orgId }) {
      nodes {
          userId
          count
          collectible {
            id
            slug
            name
            type
            targetType
            fileRel {
              fileObj {
                cdn
                data
                prefix
                contentType
                type
                variations
                ext
              }
            }
            data {
              category
              redeemType
              redeemButtonText
              redeemData
              description
            }
          }
      }
    }
  }
`;
