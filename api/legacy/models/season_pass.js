const BASE_FIELDS = `
id, orgId, name
daysRemaining,
orgUserCounterTypeId
levels {
  levelNum
  minXp
  rewards {
    sourceType
    sourceId
    tierNum
    description
    amountValue
    source {
      id
      slug
      fileRel { fileObj { cdn, prefix, data, variations, ext } }
      name
      type
      targetType
      ownedCollectible { count }
      data {
        description
        redeemType
        redeemData
      }
    }
  }
}
data
`

const ECONOMY_ACTIONS = `
economyActions {
  id
  orgId
  name
  action
  sourceType
  amountValue
  economyTriggerId
  data {
    description
    # transactions
    timeScale
    numActions
    maxActions
    actionLink
    amountDescription
  }
}`

const SEASON_PASS_PROGRESSION = `seasonPassProgression {
  tierNum
  changesSinceLastViewed {
    levelNum
    rewards {
      sourceType
      sourceId
      source {
        id
        slug
        fileRel { fileObj { cdn, prefix, data, variations, ext } }
        name
        type
        targetType
        ownedCollectible { count }
        data {
          description
          redeemType
          redeemData
        }
      }
      tierNum
      description
    }
  }
}`

const ECONOMY_ACTION_TRANSACTION = `economyTransactionConnection(userId: $userId) {
  nodes {
    id
    userId
    orgId
    amountValue
    date
    economyAction {
      id
      name
      action
    }
  }
}`

export default class SeasonPass {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = () => {
    return this.auth.stream({
      query: `query SeasonPassGetAll {
        seasonPassConnection { nodes { id, name, startTime } }
      }`,
      pull: 'seasonPassConnection'
    })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `query SeasonPassById($id: ID) {
        seasonPass(id: $id) { ${BASE_FIELDS}, startTime, endTime, levelsRaw, data }
      }`,
      variables: { id },
      pull: 'seasonPass'
    })
  }

  getCurrent = ({ shouldReturnInvalidateFn } = {}) => {
    return this.auth.stream({
      query: `
        query SeasonPassGetCurrent {
          seasonPass {
            ${BASE_FIELDS}
            ${ECONOMY_ACTIONS}
            xp {
              count
            }
            # to show UI on what they've earned since last visit
            ${SEASON_PASS_PROGRESSION}
          }
        }`,
      // variables: {},
      pull: 'seasonPass',
      shouldReturnInvalidateFn
    })
  }

  getCurrentUserSeasonPass = ({ userId }) => {
    return this.auth.stream({
      query: `
        query SeasonPassGetCurrentUserSeasonPass($userId: ID) {
          seasonPass {
            ${BASE_FIELDS}
            xp(userId: $userId) {
              count
            }
            orgUserCounter(userId: $userId) {
              count
              rank
              orgUser {
                email
              }
              user { id, name, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } }
              ${ECONOMY_ACTION_TRANSACTION}
            }
            seasonPassProgression {
              id
              tierNum
            }
          }
        }`,
      variables: {
        userId
      },
      pull: 'seasonPass'
    })
  }

  upsert = ({ id, name, startTime, endTime, levels, data }) => {
    return this.auth.call({
      query: `
        mutation SeasonPassUpsert(
          $id: ID
          $name: String
          $startTime: Date
          $endTime: Date
          $levels: JSON
          $data: JSON
        ) {
          seasonPassUpsert(id: $id, name: $name, startTime: $startTime, endTime: $endTime, levels: $levels, data: $data) { id }
        }`,
      variables: { id, name, startTime, endTime, levels, data },
      pull: 'seasonPassUpsert'
    }, { invalidateAll: true })
  }
}
