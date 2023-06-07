import { gql } from "../../deps.ts";

export const FCM_TOKEN_QUERY = gql`
  query($token: String) {
    notificationMediumUserConfig (input: {
      notificationMediumSlug: fcm,
      notificationMediumKey: $token
    }) {
      id
    }
  }
`;

export const UPSERT_FCM_TOKEN_MUTATION = gql`
  mutation($token: String, $platform: String) {
    notificationMediumUserConfigUpsert (input: {
      notificationMediumSlug: fcm,
      notificationMediumKey: $token,
      config: {
        registrationToken: $token,
        platform: $platform
      }
    }) {
      id
    }
  }
`;

export const DELETE_FCM_TOKEN_MUTATION = gql`
  mutation($token: String) {
    notificationMediumUserConfigDelete (input: {
      notificationMediumSlug: fcm,
      notificationMediumKey: $token
    }) {
      id
    }
  }
`;
