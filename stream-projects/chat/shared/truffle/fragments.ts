import { gql } from "../../deps.ts";

export const TRUFFLE_BADGE_FRAGMENT = gql`
  fragment TruffleBadgeFields on ActivePowerup {
    id
    orgId
    powerup {
      id
      slug
      componentRels {
          props
      }
    }
  }
`;

export const ORG_USER_CHAT_INFO_FIELDS = gql`
  fragment OrgUserChatInfoFields on OrgUser {
    name
    orgId
    userId
    keyValueConnection {
      nodes {
        key
        value
      }
    }
    user {
      name
    }
    activePowerupConnection {
      nodes {
        ...TruffleBadgeFields
      }
    }
  }
  ${TRUFFLE_BADGE_FRAGMENT}
`;
