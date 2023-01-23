import { gql } from "@urql/core";

export const ME_USER_QUERY = gql`
  query SDKMeQuery {
    me {
      id
      name
      avatarImage {
        cdn
        prefix
        ext
        variations {
          postfix
          width
          height
        }
        aspectRatio
      }
    }
  }
`