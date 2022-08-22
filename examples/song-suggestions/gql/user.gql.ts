import { gql } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";

export const ME_QUERY = gql`
  query {
    me {
      id
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
`;

export const MOGUL_TV_SIGNIN_MUTATION = gql`
  mutation MogulTvSignin($token: String) {
    mogulTvSignIn(token: $token) {
      sub
      name
      truffleAccessToken
    }
  }
`;
