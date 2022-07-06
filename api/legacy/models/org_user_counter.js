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
export default class OrgUserCounter {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAllByCounterTypeId = (orgUserCounterTypeId, { limit = 10 } = {}) => {
    return this.auth.stream({
      query: `
        query OrgUserCounterTypes($orgUserCounterTypeId: ID, $limit: Int) {
          orgUserCounters(orgUserCounterTypeId: $orgUserCounterTypeId, limit: $limit) {
          nodes {
            count
            orgUser {
              id, user { id, name, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } }
              seasonPass { orgUserStats { xp, levelNum, rank } }
              activePowerupConnection {
                nodes {
                  powerup {
                    componentRels { component { id } }
                    jsx
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {
        orgUserCounterTypeId,
        limit
      },
      pull: 'orgUserCounters'
    })
  }

  getMeByCounterTypeId = (orgUserCounterTypeId, { shouldIncludeEconomyTransactionConnection, shouldIncludeRank, shouldReturnInvalidateFn } = {}) => {
    return this.auth.stream({
      query: `
        query OrgUserCounterType($orgUserCounterTypeId: ID) {
          orgUserCounter(orgUserCounterTypeId: $orgUserCounterTypeId) {
            ${shouldIncludeRank ? 'rank' : ''}
            count
            orgUserCounterTypeId
            user { id, name, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } }
            ${shouldIncludeEconomyTransactionConnection ? `economyTransactionConnection {
              nodes {
                id
                userId
                orgId
                economyActionId
                amountValue
                date
                economyAction {
                  id
                  name
                  action
                }
              }
            }` : ''}
          }
        }`,
      variables: {
        orgUserCounterTypeId
      },
      pull: 'orgUserCounter',
      shouldReturnInvalidateFn
    })
  }

  getBySporeUserIdSporeOrgIdCounterTypeId = (sporeUserId, sporeOrgId, orgUserCounterTypeId, { shouldIncludeRank, shouldIncludeTransactions } = {}) => {
    return this.auth.stream({
      query: `
        query OrgUserCounterType($sporeUserId: ID, $sporeOrgId: ID, $orgUserCounterTypeId: ID, $userId: ID) {
          orgUserCounter(sporeUserId: $sporeUserId, sporeOrgId: $sporeOrgId, orgUserCounterTypeId: $orgUserCounterTypeId) {
            ${shouldIncludeRank ? 'rank' : ''}
            count
            orgUserCounterTypeId
            ${shouldIncludeTransactions ? ECONOMY_ACTION_TRANSACTION : ''}
          }
        }`,
      variables: {
        sporeUserId,
        sporeOrgId,
        orgUserCounterTypeId,
        userId: sporeUserId
      },
      pull: 'orgUserCounter'
    })
  }
}
