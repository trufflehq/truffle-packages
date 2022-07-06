const ORG_USER = `
orgUser {
  id
  hasDonated
  activePowerupConnection {
    nodes {
      powerup {
        componentRels { component { id } }
        jsx
      }
    }
  }
  roles {
    nodes {
      slug
    }
  }
  user {
    id
    name
    avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio }
  }
}`

export default class Comment {
  constructor ({ auth }) {
    this.auth = auth
  }

  create = ({ body, topId, topType, parentId, parentType }) => {
    window?.ga?.('send', 'event', 'social_interaction', 'comment', `${parentId}`)

    return this.auth.call({
      query: `
        mutation CommentCreate($body: String, $topId: ID, $topType: String, $parentId: ID, $parentType: String) {
          commentCreate(body: $body, topId: $topId, topType: $topType, parentId: $parentId, parentType: $parentType) {
            id
          }
        }`,
      variables: { body, topId, topType, parentId, parentType },
      pull: 'commentCreate'
    }, { invalidateAll: true })
  }

  flag = (id) => {
    return this.auth.call(`${this.namespace}.flag`, { id })
  }

  getAllByTopId = (topId, { sort, skip, limit } = {}) => {
    return this.auth.stream({
      // currently 3 levels deep of comments
      query: `
        query CommentsByTopId($topId: ID!, $sort: SortEnum, $skip: Int, $limit: Int) {
          comments(topId: $topId, sort: $sort, skip: $skip, limit: $limit) {
            nodes {
              ...commentFields
              children {
                ...commentFields
                children {
                  ...commentFields
                  children {
                    ...commentFields
                  }
                }
              }
            }
          }
        }
        fragment commentFields on Comment {
          id, topId, body, data, time, ${ORG_USER}
          reactionCounts { sourceType, sourceId, source, count }
          myReactions { sourceType, sourceId, source, vote }
        }`,
      variables: { topId, sort, skip, limit },
      pull: 'comments'
    })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation CommentDeleteById($id: ID!) {
          commentDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'commentDeleteById'
    }, { invalidateAll: true })
  }

  deleteAllByUserId (userId) {
    return this.auth.call({
      query: `
        mutation CommentDeleteAllByUserId($userId: ID) {
          commentDeleteAllByUserId(userId: $userId)
        }`,
      variables: { userId },
      pull: 'commentDeleteAllByUserId'
    }, { invalidateAll: true })
  }
}
