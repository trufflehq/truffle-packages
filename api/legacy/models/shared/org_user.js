import _ from 'https://npm.tfl.dev/lodash?no-check'
import { FRAGMENT_ORG_USER_WITH_ROLES, ANALYTICS_ORG_USER_COUNTER_TYPE_MAP } from '../../constants.js'

import { abbreviateDollar, abbreviateNumber } from 'https://tfl.dev/@truffle/utils@0.0.1/format/format.js'
import { Obs } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'

// viewPrivateBlock, viewPrivateDashboard
// const ONE_HOUR_SECONDS = 3600
const CENTS_IN_DOLLAR = 100

export default class OrgUser {
  constructor ({ auth }) {
    this.auth = auth
  }

  // uses orgSlug automatically
  getMe = () => {
    return this.auth.stream({
      // query name important for caching
      query: `
        query CacheableOrgUserWithRoles {
          orgUser {
            ...orgUserWithRoles
          }
        } ${FRAGMENT_ORG_USER_WITH_ROLES}`,
      // variables: {},
      pull: 'orgUser'
    })
  }

  getMeActivePowerups = () => {
    return this.auth.stream({
      query: `
        query OrgUserWithActivePowerups {
          orgUser {
            activePowerupConnection {
              nodes {
                creationDate
                data {
                  rgba
                  value
                }
                powerup {
                  id
                }
              }
            }
          }
        }`,
      // variables: {},
      pull: 'orgUser'
    })
  }

  getMeWithKV = () => {
    return this.auth.stream({
      query: `
        query OrgUserWithKV {
          orgUser {
            keyValueConnection {
              nodes {
                key
                value
              }
            }
          }
        }
      `,
      pull: 'orgUser'
    })
  }

  getMeActivePowerupsWithJsx = () => {
    return this.auth.stream({
      query: `
        query OrgUserWithActivePowerups {
          orgUser {
            activePowerupConnection {
              nodes {
                creationDate
                powerup {
                  id
                  componentRels { component { id } }
                  jsx
                }
              }
            }
          }
        }`,
      // variables: {},
      pull: 'orgUser'
    })
  }

  getByIdAdmin = (id) => {
    return this.auth.stream({
      query: `
        query OrgUserById($id: ID!) {
          orgUser(id: $id) {
            id, userId, orgId, name, email, roleIds, referrer, country, state, socials, bio
            ownedCollectibleConnection { nodes { count, collectible { id, name } } }
          }
        }`,
      variables: { id },
      pull: 'orgUser'
    })
  }

  // queried by users
  getByUserId = (userId) => {
    if (!userId) {
      console.error('Cannot get org user; `userId` not provided.')
      return
    }
    return this.auth.stream({
      query: `
        query OrgUserById($userId: ID!) {
          orgUser(userId: $userId) {
            id, userId, orgId, name, roleIds, referrer, country, state, socials, bio
          }
        }`,
      variables: { userId },
      pull: 'orgUser'
    })
  }

  getByUserIdWithPowerups = (userId) => {
    if (!userId) {
      console.error('Cannot get org user; `userId` not provided.')
      return Obs.of(null)
    }
    return this.auth.stream({
      query: `
        query OrgUserById($userId: ID!) {
          orgUser(userId: $userId) {
            id, userId, name
            user {
              name
              avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio }
            }
            activePowerupConnection {
              nodes {
                powerup {
                  jsx
                  componentRels { component { id } }
                }
              }
            }
          }
        }`,
      variables: { userId },
      pull: 'orgUser'
    })
  }

  search = ({ query, sort, limit }) => {
    return this.auth.stream({
      query: `
        query OrgUserSearch($query: ESQuery, $sort: JSON, $limit: Int) {
          orgUsers(query: $query, sort: $sort, limit: $limit) {
            totalCount
            nodes {
              id
              orgId
              email
              phone
              user { id, name, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } }
              roleIds
              roles { nodes { id, name, rank } }
              time
              newsSubscribedContactMethods
              orgUserCounterMap
            }
          }
        }`,
      variables: { query, sort, limit },
      pull: 'orgUsers'
    })
  }

  searchByName = (nameQueryStr) => {
    return this.auth.stream({
      query: `
        query OrgUserSearchByName($nameQueryStr: String) {
          orgUsers(nameQueryStr: $nameQueryStr) {
            nodes {
              id
              orgId
              user { id, name }
            }
          }
        }`,
      variables: { nameQueryStr },
      pull: 'orgUsers'
    })
  }

  // TODO: move to all-shared (also in backend permissionService)
  hasPermission = ({ orgUser, me, permissions, filters, roles }) => {
    roles = _.orderBy(roles?.nodes, 'rank')
    // eg. if filters.length is 3, first grab all role permissions that match all 3, then those that match 2, then 1
    // order matters (most relevant returned first)
    const userPermissions = _.filter(_.flatten(_.map(roles, (role) => {
      const filterPermissions = _.filter(_.flatten(_.map(_.range(filters.length).reverse(), (i) => {
        const subsetOfFilters = _.takeRight(filters, i + 1)
        const filterPermissionsWithId = _.find(role.permissions.nodes, (rolePermissions) =>
          _.every(subsetOfFilters, ({ type, id }) =>
            _.find(rolePermissions.filters, (roleFilter) => {
              const isIdMatch = id === roleFilter.id
              const neitherHasId = !roleFilter.id && !id
              return type === roleFilter.type && (isIdMatch || neitherHasId)
            }))
        )
        const filterPermissionsWithoutId = _.find(role.permissions.nodes, (rolePermissions) =>
          _.every(subsetOfFilters, ({ type, id }) =>
            _.find(rolePermissions.filters, (roleFilter) =>
              type === roleFilter.type && !roleFilter.id
            ))
        )
        return [filterPermissionsWithId, filterPermissionsWithoutId]
      })))

      const globalPermissions = _.filter(role.permissions.nodes, { filters: [{ type: 'global' }] })

      return filterPermissions.concat(globalPermissions)
    })))

    return _.every(permissions, (permission) =>
      _.find(userPermissions, (perm) => {
        return perm.permission === permission && (perm.value === true || perm.value === false)
      })?.value
    )
  }

  setRoleIdsById = ({ id, roleIds }) => {
    return this.auth.call({
      query: `
        mutation OrgUserSetRoleIds(
          $id: ID
          $roleIds: [ID]
        ) {
          orgUserSetRoleIds(id: $id, roleIds: $roleIds) {
            roleIds
          }
        }`,
      variables: { id, roleIds },
      pull: 'orgUserSetRoleIds'
    }, { invalidateAll: true })
  }

  upsert = ({ bio, socials, country, region, dateOfBirth }) => {
    return this.auth.call({
      query: `
        mutation OrgUserUpsert(
          $bio: String
          $socials: JSON
          $country: String
          $region: String
          $dateOfBirth: Date
        ) {
          orgUserUpsert(bio: $bio, socials: $socials, country: $country, region: $region, dateOfBirth: $dateOfBirth) {
            id
          }
        }`,
      variables: { bio, socials, country, region, dateOfBirth },
      pull: 'orgUserUpsert'
    }, { invalidateAll: true })
  }

  smsOptIn = () => {
    return this.auth.call({
      query: `
        mutation OrgUserSmsOptIn {
          orgUserSmsOptIn
        }`,
      // variables: {},
      pull: 'orgUserSmsOptIn'
    })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation OrgUserDeleteById($id: ID) {
          orgUserDeleteById(id: $id)
        }
`,
      variables: { id },
      pull: 'orgUserDeleteById'
    }, { invalidateAll: true })
  }

  isMember = (orgUser) => {
    return Boolean(orgUser?.id)
  }

  getFilters = ({ lang, roles }) => {
    // const states = []
    return [
      // {
      //   id: 'state', // used as ref/key
      //   field: 'state',
      //   title: lang.get('filter.fundedStates.title'),
      //   type: 'listOr',
      //   items: _.mapValues(states, (state, stateCode) => ({
      //     label: state
      //   })),
      //   getTagsFn: (value) => {
      //     return _.filter(_.map(value, (val, key) => {
      //       if (val) {
      //         return { text: states[key] }
      //       }
      //     }))
      //   },
      //   queryFn: (value, key) => {
      //     return { match: { state: key } }
      //   }
      // },
      {
        id: 'roleIds', // used as ref/key
        field: 'roleIds',
        type: 'fieldList',
        name: lang.get('filter.roles'),
        items: _.map(roles, (role) => ({
          key: role.id, label: role.name
        }))
      },
      {
        id: 'centsSpent', // used as ref/key
        field: `orgUserCounterMap.${ANALYTICS_ORG_USER_COUNTER_TYPE_MAP.centsSpent}`,
        type: 'minMax',
        name: lang.get('filter.moneySpent'),
        minOptions: [
          { value: `${0 * CENTS_IN_DOLLAR}`, text: lang.get('filter.noMin') },
          { value: `${1 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(1) },
          { value: `${10 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(10) },
          { value: `${100 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(100) },
          { value: `${1000 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(1000) },
          { value: `${10000 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(10000) }
        ],
        maxOptions: [
          { value: `${0 * CENTS_IN_DOLLAR}`, text: lang.get('filter.noMax') },
          { value: `${1 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(1) },
          { value: `${10 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(10) },
          { value: `${100 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(100) },
          { value: `${1000 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(1000) },
          { value: `${10000 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(10000) }
        ]
      },
      // {
      //   id: 'purchases', // used as ref/key
      //   field: `orgUserCounterMap.${ANALYTICS_ORG_USER_COUNTER_TYPE_MAP.purchaseCount}`,
      //   type: 'minMax',
      //   name: lang.get('filter.purchases'),
      //   minOptions: [
      //     { value: '0', text: lang.get('filter.noMin') },
      //     { value: '1', text: abbreviateNumber(1) },
      //     { value: '5', text: abbreviateNumber(5) },
      //     { value: '10', text: abbreviateNumber(10) },
      //     { value: '100', text: abbreviateNumber(100) },
      //     { value: '1000', text: abbreviateNumber(1000) }
      //   ],
      //   maxOptions: [
      //     { value: '0', text: lang.get('filter.noMax') },
      //     { value: '1', text: abbreviateNumber(1) },
      //     { value: '5', text: abbreviateNumber(5) },
      //     { value: '10', text: abbreviateNumber(10) },
      //     { value: '100', text: abbreviateNumber(100) },
      //     { value: '1000', text: abbreviateNumber(1000) }
      //   ]
      // },
      {
        id: 'chatMessageCount', // used as ref/key
        field: `orgUserCounterMap.${ANALYTICS_ORG_USER_COUNTER_TYPE_MAP.chatMessageCount}`,
        type: 'minMax',
        name: lang.get('filter.chatMessageCount'),
        minOptions: [
          { value: '0', text: lang.get('filter.noMin') },
          { value: '1', text: abbreviateNumber(1) },
          { value: '5', text: abbreviateNumber(5) },
          { value: '10', text: abbreviateNumber(10) },
          { value: '100', text: abbreviateNumber(100) },
          { value: '1000', text: abbreviateNumber(1000) }
        ],
        maxOptions: [
          { value: '0', text: lang.get('filter.noMax') },
          { value: '1', text: abbreviateNumber(1) },
          { value: '5', text: abbreviateNumber(5) },
          { value: '10', text: abbreviateNumber(10) },
          { value: '100', text: abbreviateNumber(100) },
          { value: '1000', text: abbreviateNumber(1000) }
        ]
      },
      {
        id: 'podcastPlayCount', // used as ref/key
        field: `orgUserCounterMap.${ANALYTICS_ORG_USER_COUNTER_TYPE_MAP.podcastPlayCount}`,
        type: 'minMax',
        name: lang.get('filter.podcastPlayCount'),
        minOptions: [
          { value: '0', text: lang.get('filter.noMin') },
          { value: '1', text: abbreviateNumber(1) },
          { value: '5', text: abbreviateNumber(5) },
          { value: '10', text: abbreviateNumber(10) },
          { value: '100', text: abbreviateNumber(100) },
          { value: '1000', text: abbreviateNumber(1000) }
        ],
        maxOptions: [
          { value: '0', text: lang.get('filter.noMax') },
          { value: '1', text: abbreviateNumber(1) },
          { value: '5', text: abbreviateNumber(5) },
          { value: '10', text: abbreviateNumber(10) },
          { value: '100', text: abbreviateNumber(100) },
          { value: '1000', text: abbreviateNumber(1000) }
        ]
      },
      // {
      //   id: 'maxPurchaseCents', // used as ref/key
      //   field: `orgUserCounterMap.${ANALYTICS_ORG_USER_COUNTER_TYPE_MAP.maxPurchaseCents}`,
      //   type: 'minMax',
      //   name: lang.get('filter.maxPurchase'),
      //   minOptions: [
      //     { value: `${0 * CENTS_IN_DOLLAR}`, text: lang.get('filter.noMin') },
      //     { value: `${10 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(10) },
      //     { value: `${100 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(100) },
      //     { value: `${1000 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(1000) },
      //     { value: `${10000 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(10000) }
      //   ],
      //   maxOptions: [
      //     { value: `${0 * CENTS_IN_DOLLAR}`, text: lang.get('filter.noMax') },
      //     { value: `${10 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(10) },
      //     { value: `${100 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(100) },
      //     { value: `${1000 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(1000) },
      //     { value: `${10000 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(10000) }
      //   ]
      // },
      // {
      //   id: 'averagePurchaseCents', // used as ref/key
      //   field: `orgUserCounterMap.${ANALYTICS_ORG_USER_COUNTER_TYPE_MAP.averagePurchaseCents}`,
      //   type: 'minMax',
      //   name: lang.get('filter.averagePurchase'),
      //   minOptions: [
      //     { value: `${0 * CENTS_IN_DOLLAR}`, text: lang.get('filter.noMin') },
      //     { value: `${1 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(1) },
      //     { value: `${5 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(5) },
      //     { value: `${10 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(10) },
      //     { value: `${50 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(50) },
      //     { value: `${100 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(100) }
      //   ],
      //   maxOptions: [
      //     { value: `${0 * CENTS_IN_DOLLAR}`, text: lang.get('filter.noMax') },
      //     { value: `${1 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(1) },
      //     { value: `${5 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(5) },
      //     { value: `${10 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(10) },
      //     { value: `${50 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(50) },
      //     { value: `${100 * CENTS_IN_DOLLAR}`, text: abbreviateDollar(100) }
      //   ]
      // },
      // {
      //   id: 'secondsInApp', // used as ref/key
      //   field: `orgUserCounterMap.${ANALYTICS_ORG_USER_COUNTER_TYPE_MAP.secondsInApp}`,
      //   type: 'minMax',
      //   name: lang.get('filter.hoursInApp'),
      //   minOptions: [
      //     { value: '0', text: lang.get('filter.noMin') },
      //     { value: `${ONE_HOUR_SECONDS}`, text: abbreviateNumber(1) },
      //     { value: `${5 * ONE_HOUR_SECONDS}`, text: abbreviateNumber(5) },
      //     { value: `${10 * ONE_HOUR_SECONDS}`, text: abbreviateNumber(10) },
      //     { value: `${100 * ONE_HOUR_SECONDS}`, text: abbreviateNumber(100) },
      //     { value: `${1000 * ONE_HOUR_SECONDS}`, text: abbreviateNumber(1000) }
      //   ],
      //   maxOptions: [
      //     { value: '0', text: lang.get('filter.noMax') },
      //     { value: `${ONE_HOUR_SECONDS}`, text: abbreviateNumber(1) },
      //     { value: `${5 * ONE_HOUR_SECONDS}`, text: abbreviateNumber(5) },
      //     { value: `${10 * ONE_HOUR_SECONDS}`, text: abbreviateNumber(10) },
      //     { value: `${100 * ONE_HOUR_SECONDS}`, text: abbreviateNumber(100) },
      //     { value: `${1000 * ONE_HOUR_SECONDS}`, text: abbreviateNumber(1000) }
      //   ]
      // },
      {
        id: 'isPushSubscribedSms', // used as ref/key
        field: 'newsSubscribedContactMethods',
        name: lang.get('filter.isPushSubscribedSms'),
        type: 'booleanArray',
        arrayValue: 'sms',
        isBoolean: true
      },
      {
        id: 'isPushSubscribedEmail', // used as ref/key
        field: 'newsSubscribedContactMethods',
        name: lang.get('filter.isPushSubscribedEmail'),
        type: 'booleanArray',
        arrayValue: 'email',
        isBoolean: true
      },
      // {
      //   id: 'isSubscriber', // used as ref/key
      //   field: 'isSubscriber',
      //   name: lang.get('filter.isSubscriber'),
      //   type: 'boolean',
      //   isBoolean: true
      // },
      // {
      //   id: 'wasSubscriber', // used as ref/key
      //   field: 'wasSubscriber',
      //   name: lang.get('filter.wasSubscriber'),
      //   type: 'boolean',
      //   isBoolean: true
      // },
      {
        id: 'referrer', // used as ref/key
        field: 'referrer',
        fields: ['referrer'],
        type: 'searchPhrase',
        name: lang.get('filter.referrer'),
        placeholder: lang.get('filter.referrer')
      },
      {
        id: 'country', // used as ref/key
        field: 'country',
        fields: ['country'],
        type: 'searchPhrase',
        name: lang.get('filter.country'),
        placeholder: lang.get('filter.country')
      },
      {
        id: 'state', // used as ref/key
        field: 'region',
        fields: ['region'],
        type: 'searchPhrase',
        name: lang.get('filter.state'),
        placeholder: lang.get('filter.state')
      }
      // {
      //   id: 'city', // used as ref/key
      //   field: 'city',
      //   fields: ['city'],
      //   type: 'searchPhrase',
      //   name: lang.get('filter.city'),
      //   placeholder: lang.get('filter.city')
      // },
      // {
      //   id: 'language', // used as ref/key
      //   field: 'language',
      //   fields: ['language'],
      //   type: 'searchPhrase',
      //   name: lang.get('filter.language'),
      //   placeholder: lang.get('filter.language')
      // }
    ]
  }
}
