import _ from 'https://npm.tfl.dev/lodash?no-check'

import { op } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import { getCookie, setCookie } from 'https://tfl.dev/@truffle/utils@0.0.1/cookie/cookie.js'

const GRAPHQL_FIELDS = 'id, slug, isRead, lastUpdateTime, data, users { id, name, avatarImage { cdn, prefix, variations { postfix }, ext } }'
const CHATS_GET_ALL_GRAPHQL = `
  query Chats {
    chats {
      nodes { ${GRAPHQL_FIELDS} }
    }
  }`
const CHATS_GET_ALL_ORG_GRAPHQL = `
  query Chats {
    chats(isOrg: true) {
      nodes { id, slug, data, type }
    }
  }`

export default class Chat {
  constructor ({ auth }) {
    this.auth = auth
  }

  createIfNotExists ({ userIds, name, description }) {
    return this.auth.call({
      query: `
        mutation ChatCreateIfNotExists(
          $userIds: [ID]
          $name: String
          $description: String
        ) {
          chatCreateIfNotExists(userIds: $userIds, name: $name, description: $description) {
            id
          }
        }`,
      variables: { userIds, name, description },
      pull: 'chatCreateIfNotExists'
    })
  }

  upsert = ({ id, slug, data }) => {
    return this.auth.call({
      query: `
        mutation ChatUpsert(
          $id: ID
          $slug: String
          $data: JSON
        ) {
          chatUpsert(id: $id, slug: $slug, data: $data) {
            id
          }
        }`,
      variables: { id, slug, data },
      pull: 'chat'
    }, { invalidateAll: true })
  }

  getAll = () => {
    return this.auth.stream({
      query: CHATS_GET_ALL_GRAPHQL,
      streamOptions: {
        streamGraphQL: `{ ${GRAPHQL_FIELDS} }`
      },
      pull: 'chats'
    }, { isStreamed: true, shouldPrependNewUpdates: true })
  }

  getAllByMeOrg = () => {
    return this.auth.stream({
      query: CHATS_GET_ALL_ORG_GRAPHQL,
      streamOptions: {
        streamGraphQL: `{ ${GRAPHQL_FIELDS} }`
      },
      pull: 'chats'
    }, { isStreamed: true })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query ChatById($id: ID!) {
          chat(id: $id) {
            id, type, users { id, name, avatarImage { prefix, variations { postfix }, ext } }
          }
        }`,
      variables: { id },
      pull: 'chat'
    })
  }

  getBySlug = (slug) => {
    return this.auth.stream({
      query: `
        query ChatBySlug($slug: String!) {
          chat(slug: $slug) {
            id, type, users { id, name, avatarImage { prefix, variations { postfix }, ext } }
          }
        }`,
      variables: { slug },
      pull: 'chat'
    })
  }

  getHasUnreadMessagesObs = () => {
    return this.getAll().pipe(
      op.map((chats) => {
        return (chats && _.isEmpty(chats.nodes)) || _.some(chats?.nodes, { isRead: false })
      })
    )
  }

  getCurrent = ({ slug, currentChatIdRef }) => {
    return this.getAllByMeOrg().pipe(
      op.map((chats) => {
        const lastChatSlugCookie = `org_${chats?.nodes?.[0]?.orgId}_lastChatSlug`

        slug = slug || getCookie(lastChatSlugCookie)

        let chat
        if (slug) {
          chat = _.find(chats?.nodes, { slug: slug })
        }

        if (!chat) {
          chat = _.find(chats?.nodes, ({ slug, isDefault }) =>
            isDefault || (slug === 'general')
          )
          chat = chat || chats?.nodes?.[0]
          slug = chat?.id
        }

        // side-effects
        if (slug !== currentChatIdRef.current) {
          if (chats?.nodes?.[0]?.orgId) {
            setCookie(
              lastChatSlugCookie,
              slug
            )
          }
        }

        currentChatIdRef.current = slug

        return chat
      })
    )
  }

  markReadById = (id) => {
    return this.auth.call({
      query: `
        mutation ChatMarkReadById($id: ID) {
          chatMarkReadById(id: $id)
        }`,
      variables: { id },
      pull: 'chatMarkReadById'
    }, {
      invalidateSingle: {
        query: CHATS_GET_ALL_GRAPHQL,
        streamOptions: {
          streamGraphQL: `{ ${GRAPHQL_FIELDS} }`
        }
      }
    })
  }

  setRanks = (ids) => {
    return this.auth.call({
      query: `
        mutation ChatSetRanks(
          $ids: [ID]
        ) {
          chatSetRanks(ids: $ids)
        }`,
      variables: { ids },
      pull: 'chat'
    }, { invalidateAll: true })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation ChatDeleteById($id: ID) {
          chatDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'chatDeleteById'
    }, { invalidateAll: true })
  }
}
