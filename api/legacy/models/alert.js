import { AlertStatus } from '../constants.js'

const GRAPHQL_FIELDS = `
  id,
  message,
  status,
  type,
  user { id, name, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } }
  data
`
// fields that get processed server-side once and pubsub'd
const PREPARE_GRAPHQL_FIELDS = GRAPHQL_FIELDS

// TODO: can probably bake this proxy/upload stuff into graphqlClient
// so Link, Link, etc... don't need to do extra heavy lifting
export default class Alert {
  constructor ({ auth, proxy, apiUrl, graphqlClient }) {
    this.auth = auth
    this.proxy = proxy
    this.apiUrl = apiUrl
    this.graphqlClient = graphqlClient
  }

  getAll = ({ isStreamed } = {}) => {
    const options = {
      isStreamed,
      shouldPrependNewUpdates: false
    }
    return this.auth.stream({
      query: `
        query Alerts {
          alerts {
            nodes { ${GRAPHQL_FIELDS} }
          }
        }`,
      streamOptions: {
        streamGraphQL: `{ ${GRAPHQL_FIELDS} }`
      },
      // variables: {  },
      pull: 'alerts'
    }, options)
  }

  getAllReadyByStatusAndType = ({ isStreamed, type } = {}) => {
    const options = {
      isStreamed,
      shouldPrependNewUpdates: false
    }
    return this.auth.stream({
      query: `
        query AlertsReadyByType($status: String, $type: String) {
          alerts(status: $status, type: $type) {
            nodes { ${GRAPHQL_FIELDS} }
          }
        }`,
      streamOptions: {
        streamGraphQL: `{ ${GRAPHQL_FIELDS} }`
      },
      variables: { status: AlertStatus.READY, type },
      pull: 'alerts'
    }, options)
  }

  getAllReadyByStatus = ({ isStreamed } = {}) => {
    const options = {
      isStreamed,
      shouldPrependNewUpdates: false
    }
    return this.auth.stream({
      query: `
        query AlertsReadyByType($status: String) {
          alerts(status: $status) {
            nodes { ${GRAPHQL_FIELDS} }
          }
        }`,
      streamOptions: {
        streamGraphQL: `{ ${GRAPHQL_FIELDS} }`
      },
      variables: { status: AlertStatus.READY },
      pull: 'alerts'
    }, options)
  }

  upsert = async ({ id, status, message, data, type, sourceType, sourceId }) => {
    const query = `
      mutation AlertUpsert(
        $id: ID
        $status: String
        $message: String,
        $data: JSON,
        $type: String
        $sourceType: String
        $sourceId: ID
      ) {
        alertUpsert(
          id: $id
          status: $status
          message: $message
          data: $data
          type: $type
          sourceType: $sourceType
          sourceId: $sourceId
        ) { id, status, message, data, type }
      }
`
    const variables = { id, status, message, data, type, sourceType, sourceId }
    const streamOptions = {
      prepareGraphQL: `{ ${PREPARE_GRAPHQL_FIELDS} }`
    }
    return this.auth.call({ query, variables, streamOptions, pull: 'alertUpsert' }, {
      invalidateAll: true
    })
  }

  markShownById = async (id) => {
    const query = `
      mutation AlertMarkShown(
        $id: ID
      ) {
        alertMarkShown(
          id: $id
        )
      }`
    const variables = { id }
    const streamOptions = {
      prepareGraphQL: `{ ${PREPARE_GRAPHQL_FIELDS} }`
    }
    return this.auth.call({ query, variables, streamOptions, pull: 'alertMarkShown' }, {
      invalidateAll: true
    })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation AlertDeleteById($id: ID) {
          alertDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'alertDeleteById'
    }, { invalidateAll: true })
  }
}
