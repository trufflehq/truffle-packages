import _ from 'https://esm.sh/lodash'
import uuid from 'https://jspm.dev/uuid@3'

import { createSubject } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'

const CHAT_MESSAGES_LIMIT = 50 // max to have rendered at once
// fields that get pub-sub'd server side
const PREPARE_GRAPHQL_FIELDS = `
  id
  clientId
  body
  type
  actionType
  time
  userId
  data
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
      avatarImage {
        cdn
        prefix
        variations { postfix }
        ext
        data
        aspectRatio # legacy (can probably rm in 2022)
      }
    }
  }
  reactionCounts { sourceType, sourceId, source, count }
  myReactions { sourceType, sourceId, source, vote }
`
// fields client needs (resolved after pubsub)
const GRAPHQL_FIELDS = `${PREPARE_GRAPHQL_FIELDS}`

const GET_ALL_QUERY = `
  query ChatMessages($parentType: ChatMessageParentTypeEnum, $parentId: ID!, $minId: ID, $maxId: ID) {
    chatMessages(parentType: $parentType, parentId: $parentId, minId: $minId, maxId: $maxId) {
      nodes { ${GRAPHQL_FIELDS} }
    }
  }`

export default class ChatMessage {
  constructor ({ auth, graphqlClient, proxy }) {
    this.auth = auth
    this.graphqlClient = graphqlClient
    this.proxy = proxy
    this.clientChangesStreamObj = {}
  }

  getAllByParentTypeAndParentId = (parentType, parentId, options = {}) => {
    const { minId, maxId, isStreamed } = options
    // buffer 0 so future streams don't try to add the client changes
    // (causes smooth scroll to bottom in chats)
    this.clientChangesStreamObj[parentId] =
      this.clientChangesStreamObj[parentId] || createSubject(null)

    options = {
      // initialSortFn: (items) => {
      //   return _.defaults({
      //     data: _.mapValues(items.data, (data) =>
      //       _.defaults({ nodes: _.sortBy(data.nodes, 'time') }, data)
      //     )
      //   }, items)
      // },
      limit: CHAT_MESSAGES_LIMIT,
      clientChangesStream: this.clientChangesStreamObj[parentId],
      // i'm not sure if this is ideal, but for old messages, we don't load in
      // streamed updates from the server. this 1) prevents new messages
      // from getting inserted into older streams, and 2) maybe is better for
      // perf? clientChangesStream changes still work though.
      // to fix, the problem seems to be the server sends to wrong streamId
      // (if isStreamed is false in streamOptions, things will still work)
      isStreamed,
      // don't accept client-side new messages to old message streams
      ignoreNewStream: !isStreamed,
      ignoreIncrementsFromMe: true // don't double-count increments, since we handle them client-side
    }

    return this.auth.stream({
      query: GET_ALL_QUERY,
      variables: _.pickBy({ parentType, parentId, minId, maxId }),
      streamOptions: {
        streamGraphQL: `{ ${GRAPHQL_FIELDS} }`
      },
      pull: 'chatMessages'
    }, options)
  }

  // FIXME
  getLastTimeByMeAndChatId (chatId) {
    return this.auth.stream(`${this.namespace}.getLastTimeByMeAndChatId`, {
      chatId
    })
  }

  create = (diff, localDiff) => {
    const { parentType, parentId, clientId = uuid.v4(), body } = diff

    this.clientChangesStreamObj[parentId]?.next({
      action: 'create',
      newVal: _.merge(diff, { clientId }, localDiff)
    })
    return this.auth.call({
      query: `
        mutation ChatMessageCreate(
          $parentType: ChatMessageParentTypeEnum
          $parentId: ID
          $clientId: ID
          $body: String
        ) {
          chatMessageCreate(parentType: $parentType, parentId: $parentId, clientId: $clientId, body: $body) {
            id
          }
        }`,
      variables: { parentType, parentId, clientId, body },
      pull: 'chatMessage',
      streamOptions: {
        prepareGraphQL: `{ ${PREPARE_GRAPHQL_FIELDS} }`
      }
    })
  }

  deleteOnClient = (parentId, clientId) => {
    this.clientChangesStreamObj[parentId]?.next({
      action: 'delete',
      clientId
    })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation ChatMessageDeleteById($id: ID) {
          chatMessageDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'chatMessageDeleteById'
    }, { invalidateAll: true })
  }

  deleteAllByUserId (userId) {
    return this.auth.call({
      query: `
        mutation ChatMessageDeleteAllByUserId($userId: ID) {
          chatMessageDeleteAllByUserId(userId: $userId)
        }`,
      variables: { userId },
      pull: 'chatMessageDeleteAllByUserId'
    }, { invalidateAll: true })
  }

  unsubscribeById (id) {
    return this.auth.call({
      query: `
        mutation ChatMessageUnsubscribeById($id: ID) {
          chatMessageUnsubscribeById(id: $id)
        }`,
      variables: { id },
      pull: 'chatMessageUnsubscribeById'
    }, {
      // force to refetch next time they visit channel
      invalidateSingle: {
        query: GET_ALL_QUERY,
        variables: { parentType: 'chat', parentId: id },
        streamOptions: {
          streamGraphQL: `{ ${GRAPHQL_FIELDS} }`
        }
      }
    })
  }
}
