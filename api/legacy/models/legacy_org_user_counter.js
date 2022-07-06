export default class LegacyOrgUserCounter {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAllByCounterTypeId = (counterTypeId, { limit = 10 }) => {
    return this.auth.stream({
      query: `
        query LegacyOrgUserCounterTypes($counterTypeId: ID, $limit: Int) {
          legacyOrgUserCounters(counterTypeId: $counterTypeId, limit: $limit) {
          nodes {
            id
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
        counterTypeId,
        limit
      },
      pull: 'legacyOrgUserCounters'
    })
  }

  getMeByCounterTypeId = (counterTypeId) => {
    return this.auth.stream({
      query: `
        query LegacyOrgUserCounter($counterTypeId: ID) {
          legacyOrgUserCounterGetMe(counterTypeId: $counterTypeId) {
            id
            count
            rank
            user { id, name, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } }
        }
      }`,
      variables: {
        counterTypeId
      },
      pull: 'legacyOrgUserCounterGetMe'
    })
  }

  upsert = ({ counterTypeId, count }) => {
    return this.auth.call({
      query: `
        mutation LegacyOrgUserCounterUpsert(
          $counterTypeId: ID
          $count: Int
          $email: String
        ) {
          legacyOrgUserCounterUpsert(counterTypeId: $counterTypeId, count: $count)
        }`,
      variables: { counterTypeId, count },
      pull: 'legacyOrgUserCounterUpsert'
    }, { invalidateAll: false })
  }

  emailDiscount = (email) => {
    return this.auth.call({
      query: `
        mutation LegacyOrgUserEmailDiscount($email: String) {
          legacyOrgUserEmailDiscount(email: $email)
        }`,
      variables: { email },
      pull: 'legacyOrgUserEmailDiscount'
    }, { invalidateAll: false })
  }
}
