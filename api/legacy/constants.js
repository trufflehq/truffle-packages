export const AUTH_COOKIE = 'accessToken'
// export const API_URL = 'https://mycelium.truffle.vip'
export const API_URL = 'https://mycelium.staging.bio'
// export const API_URL = 'http://localhost:50420'
export const CDN_URLS = {
  legacy: 'https://fdn.uno/images',
  default: 'https://cdn.bio/ugc',
  assets: 'https://cdn.bio/assets'
}

export const FRAGMENT_ORG_USER_WITH_ROLES = `fragment orgUserWithRoles on OrgUser {
  id # req for cache categoryFn
  userId
  orgId
  roleIds
  bio
  socials
  roles {
    nodes {
      id # req for cache categoryFn
      name
      rank
      isSuperAdmin
      permissions {
        nodes {
          filters
          action
          value
        }
      }
    }
  }
}
`

export const FRAGMENT_ORG_WITH_CONFIG = `fragment orgWithConfig on Org {
  id # req for cache categoryFn
  slug
  name
  domain
  phone
  timezone
  image
  orgConfig {
    fileRels
    flags
    socials
    colors
    cssVars
    pronouns
    features
    fonts
    radiusMultiplier
    data
  }
}`

export const FRAGMENT_COMPONENT_INSTANCE_FIELDS = `
fragment componentInstanceFields on ComponentInstance {
  id # req for cache categoryFn
  props
  sharedProps
  shareSlug
  cssVars
  component {
    id # req for cache categoryFn
  }
  parentId
  treeSiblingIndex
  treePath
  rank
}`

// recursion is ugly, but only option https://github.com/graphql/graphql-spec/issues/91
export const FRAGMENT_PAGE_WITH_EXTRAS = `
# keep this fragment first since we cache on it
fragment pageWithExtras on Page {
  id # req for cache categoryFn
  slug
  title
  description
  type
  data
  componentInstanceId
  componentInstances { ...componentInstanceFields }
}

${FRAGMENT_COMPONENT_INSTANCE_FIELDS}
`

// recursion is ugly, but only option https://github.com/graphql/graphql-spec/issues/91
export const FRAGMENT_COMPONENT_INSTANCE_FIELDS_ADMIN = `
fragment componentInstanceFieldsAdmin on ComponentInstance {
  id # req for cache categoryFn
  props
  sharedProps
  shareSlug
  cssVars
  component {
    id
    orgId
    exportName
    module { code }
    propTypes
  }
  parentId
  topId
  treeSiblingIndex
  treePath
  name
  rank
}
`

export const FRAGMENT_CHART_WITH_DATAPOINTS = `fragment chartWithDatapoints on Chart {
  id
  name
  settings
  metricIds
  metrics {
    nodes {
      name
      unit
      firstDatapointTime
      dimensions {
        nodes {
          slug
          datapoints(
            filterId: $filterId
            filterValue: $filterValue
            startDate: $startDate
            endDate: $endDate
            timeScale: $timeScale
          ) {
            nodes {
              scaledTime
              dimensionValue
              count
            }
          }
        }
      }
    }
  }
}`

export const defaultEconomyTriggerIds = {
  XP: {
    TIER_UNLOCK: '85e9ed40-d73d-11ec-97bc-651463e09eec', // tier-unlock
    TWITTER: {
      RETWEET: '1a146970-6f68-11ec-b706-956d4fcf75c0', // 'twitter-retweet',
      REPLY: '1b21bac0-6f68-11ec-b706-956d4fcf75c0', // 'twitter-reply',
      CREATOR_REPLY: '1c9f5a10-6f68-11ec-b706-956d4fcf75c0', // 'twitter-creator-reply',
      CREATOR_RETWEET: '1d86faf0-6f68-11ec-b706-956d4fcf75c0' // 'twitter-creator-retweet'
    },
    DISCORD: {
      MESSAGE: '288e9e80-6f68-11ec-b706-956d4fcf75c0', // 'discord-message',
      REACTION: '29c87e10-6f68-11ec-b706-956d4fcf75c0', // 'discord-reaction',
      NEW_MEMBER: '2abb4280-6f68-11ec-b706-956d4fcf75c0' // 'discord-new-member'
    },
    TWITCH: {
      WATCH_TIME: '2bca1a70-6f68-11ec-b706-956d4fcf75c0', // 'twitch-watch-time',
      CLAIM_LOOT: '2c7faed0-6f68-11ec-b706-956d4fcf75c0', // 'twitch-loot-claim',
      CHAT_MESSAGE: '2d8a4100-6f68-11ec-b706-956d4fcf75c0' // 'twitch-chat-message'
    },
    FORUM: {
      CREATE_POST: '3a2de150-6f68-11ec-b706-956d4fcf75c0', // 'forum-create-post',
      REACT_TO_POST: '3c07f880-6f68-11ec-b706-956d4fcf75c0', // 'forum-react-to-post',
      COMMENT_ON_POST: '3e0d8c80-6f68-11ec-b706-956d4fcf75c0', // 'forum-comment-on-post',
      REACTIONS_TO_POST: '3f777cc0-6f68-11ec-b706-956d4fcf75c0' // 'forum-reactions-to-post'
    },
    EXTENSION: {
      INCREMENT: 'b9d69a60-929e-11ec-b349-c56a67a258a0',
      CLAIM: 'fc93de80-929e-11ec-b349-c56a67a258a0'
    }
  },
  CHANNEL_POINTS: {
    INCREMENT: '40ab1ac0-6f68-11ec-b706-956d4fcf75c0', // 'channel-points-increment',
    CLAIM: '41760be0-6f68-11ec-b706-956d4fcf75c0', // 'channel-points-claim',
    INITIAL_CLAIM: 'dfeaaa00-92a5-11ec-b349-c56a67a258a0', // channel-points-initial-claim
    PURCHASE: '4246f070-6f68-11ec-b706-956d4fcf75c0', // 'channel-points-purchase',
    PREDICTION: '43477080-6f68-11ec-b706-956d4fcf75c0', // 'channel-points-prediction'
    PREDICTION_WIN: '5807bc10-80c4-11ec-a5c9-01fed7cc1cdc', // 'channel-points-prediction-win'
    PREDICTION_REFUND: 'e3e4e4a0-b2bb-11ec-9571-dd01980fb9d3', // 'channel-points-prediction-refund'
    ADMIN_MODIFICATION: 'ddd60d00-d17e-11ec-b0a8-ab7476fd20c7' // channel-points-admin-modification
  }
}

export const AlertActionTypes = {
  CUSTOM_MESSAGE: 'custom-message',
  TWITCH_MESSAGE: 'twitch-message',
  TWITCH_SUB: 'twitch-sub',
  TWITCH_RESUB: 'twitch-resub',
  TWITCH_CHEER: 'twitch-cheer',
  TWITCH_GIFT: 'twitch-gift',
  TWITCH_FOLLOW: 'twitch-follow'
}

export const AlertStatus = {
  SHOWN: 'shown',
  READY: 'ready'
}

// TODO: add OrgUserCounterType rows for these ids & empty orgId
export const ANALYTICS_ORG_USER_COUNTER_TYPE_MAP = {
  centsSpent: 'd6b09f10-33b1-11ec-bace-85a8f080b04c',
  purchaseCount: 'd5f90ee0-33b1-11ec-bace-85a8f080b04c',
  maxPurchaseCents: 'd514c960-33b1-11ec-bace-85a8f080b04c',
  averagePurchaseCents: 'd427f860-33b1-11ec-bace-85a8f080b04c',
  chatMessageCount: 'd3671960-33b1-11ec-bace-85a8f080b04c',
  podcastPlayCount: 'd2b29670-33b1-11ec-bace-85a8f080b04c',
  monthsSubscribed: 'd1d555d0-33b1-11ec-bace-85a8f080b04c',
  // articleCount: '',
  // commentCount: '',
  // socialInteractionCount: '',
  secondsInApp: 'd847e0e0-33b1-11ec-bace-85a8f080b04c'
}
