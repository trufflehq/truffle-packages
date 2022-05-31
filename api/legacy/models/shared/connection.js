const ORG_USER_POWERUPS_AND_COLLECTIBLES = `  orgUser {
  id
  userId
  orgId
  ownedCollectibleConnection(collectibleType: $collectibleType) {
      nodes {
          userId
          collectible {
              id
              name
              slug
              fileRel {
                  fileObj {
                      src
                      ext
                  }
              }
          }
      }
  }
  activePowerupConnection {
      totalCount
      nodes {
          id
          userId
          data {
                  rgba
                  value
              }
          powerup {
              id
              slug

              componentRels {
                  props
              }
          }
      }
  }
}`

export default class Connection {
  constructor ({ auth }) {
    this.auth = auth
  }

  getOAuthUrlBySourceType = (sourceType) => {
    return this.auth.stream({
      query: `
        query ConnectionOAuthUrl($sourceType: String) {
          connectionOAuthUrl(sourceType: $sourceType)
        }`,
      variables: { sourceType },
      pull: 'connectionOAuthUrl'
    })
  }

  getOAuthUrlsBySourceTypes = (sourceTypes) => {
    return this.auth.stream({
      query: `
        query ConnectionOAuthUrlsBySourceTypes($sourceTypes: [String]) {
          connectionGetOAuthUrlsBySourceTypes(sourceTypes: $sourceTypes) {
            oAuthUrlMap
          }
        }
      `,
      variables: { sourceTypes },
      pull: 'connectionGetOAuthUrlsBySourceTypes'
    })
  }

  getConnectionBySource = (sourceType, sourceId) => {
    return this.auth.stream({
      query: `
        query ConnectionBySource($sourceType: String, $sourceId: String) {
          connection(sourceType: $sourceType, sourceId: $sourceId) {
            id
            userId
            orgId
            sourceType
            sourceId
          }
        }
      `,
      variables: {
        sourceType,
        sourceId
      },
      pull: 'connection'
    })
  }

  getConnectionByMeAndSource = (sourceType) => {
    return this.auth.stream({
      query: `
      query ConnectionBySource($sourceType: String) {
        connection(sourceType: $sourceType) {
          id
          userId
          orgId
          sourceType
          sourceId
        }
      }
    `,
      variables: {
        sourceType
      },
      pull: 'connection'
    })
  }

  getMeWithCollectiblesAndPowerupsByConnectionCollectibleType = (sourceType, collectibleType, { shouldReturnInvalidateFn } = {}) => {
    return this.auth.stream({
      query: `
      query PowerupsConnectionByMe($sourceType: String, $collectibleType: String!) {
        connection(sourceType: $sourceType) {
          id
          orgId
          userId
          sourceType
          sourceId
          secondarySourceId
          ${ORG_USER_POWERUPS_AND_COLLECTIBLES}
        }
    }`,
      variables: {
        sourceType,
        collectibleType: 'emote'
      },
      pull: 'connection',
      shouldReturnInvalidateFn
    })
  }

  getCollectiblesAndPowerupsBySourceTypeSecondarySourceIdCollectibleType = (sourceType, secondarySourceId, collectibleType) => {
    return this.auth.stream({
      query: `
      query CacheableCollectiblesPowerupsConnectionBySourceAndSecondary ($sourceType: String, $secondarySourceId: String, $collectibleType: String!) {
        connection(sourceType: $sourceType, secondarySourceId: $secondarySourceId) {
          id
          orgId
          userId
          sourceType
          sourceId
          secondarySourceId
          ${ORG_USER_POWERUPS_AND_COLLECTIBLES}
        }
    }`,
      variables: {
        sourceType,
        secondarySourceId,
        collectibleType
      },
      pull: 'connection'
    })
  }

  getConnectionsByMe = () => {
    return this.auth.stream({
      query: `
        query ConnectionsByMe {
          connections {
            nodes {
              id
              userId
              orgId
              sourceType
              sourceId
            }
          }
        }
      `,
      pull: 'connections'
    })
  }

  getConnectionConnectionByUserId = (userId) => {
    return this.auth.stream({
      query: `
        query ConnectionsByUserId($userId: ID) {
          userConnections(userId: $userId) {
            nodes {
              id
              userId
              orgId
              sourceType
              sourceId
            }
          }
        }
      `,
      variables: {
        userId
      },
      pull: 'userConnections'
    })
  }

  deleteConnectionById = (id) => {
    return this.auth.call({
      query: `
        mutation ConnectionDeleteById($id: ID) {
          connectionDeleteById(id: $id)
        }
      `,
      variables: {
        id
      },
      pull: 'connectionDeleteById'
    }, { invalidateAll: true })
  }

  upsert = (sourceType, sourceId) => {
    return this.auth.call({
      query: `
      mutation ConnectionUpsert($sourceType: String!, $sourceId: String!) {
        connectionUpsert(sourceType: $sourceType, sourceId: $sourceId) {
          id
        }
      }`,
      variables: {
        sourceType,
        sourceId
      },
      pull: 'connectionUpsert'
    }, { invalidateAll: true })
  }
}
