const GRAPHQL_FIELDS = `
  id,
  url,
  name,
  slug
`
// fields that get processed server-side once and pubsub'd
const PREPARE_GRAPHQL_FIELDS = GRAPHQL_FIELDS

// TODO: can probably bake this proxy/upload stuff into graphqlClient
// so Link, Link, etc... don't need to do extra heavy lifting
export default class Link {
  constructor ({ auth, proxy, apiUrl, graphqlClient }) {
    this.auth = auth
    this.proxy = proxy
    this.apiUrl = apiUrl
    this.graphqlClient = graphqlClient
  }

  getAll = ({ limit, isStreamed } = {}) => {
    const options = {
      isStreamed,
      shouldPrependNewUpdates: true
    }
    return this.auth.stream({
      query: `
        query Links($limit: Int) {
          links(limit: $limit) {
            nodes { ${GRAPHQL_FIELDS} }
          }
        }`,
      streamOptions: {
        streamGraphQL: `{ ${GRAPHQL_FIELDS} }`
      },
      variables: { limit },
      pull: 'links'
    }, options)
  }

  getBySlug = (slug) => {
    return this.auth.stream({
      query: `
        query LinkBySlug($slug: String) {
          link(slug: $slug) {
            id, url
          }
        }`,
      variables: { slug },
      pull: 'link'
    })
  }

  searchByUrl = (urlQueryStr, { limit } = {}) => {
    return this.auth.stream({
      query: `
        query LinkSearchByUrl($urlQueryStr: String, $limit: Int) {
          links(urlQueryStr: $urlQueryStr, limit: $limit) {
            nodes {
              id
              slug
              url
            }
          }
        }`,
      variables: { urlQueryStr, limit },
      pull: 'links'
    })
  }

  upsert = async ({ id, name, url, sourceType, sourceId }) => {
    const query = `
      mutation LinkUpsert(
        $id: ID
        $name: String
        $url: String
        $sourceType: String
        $sourceId: String
      ) {
        linkUpsert(
          id: $id
          name: $name
          url: $url
          sourceType: $sourceType
          sourceId: $sourceId
        ) { id, url }
      }
`
    const variables = { id, name, url, sourceType, sourceId }
    const streamOptions = {
      prepareGraphQL: `{ ${PREPARE_GRAPHQL_FIELDS} }`
    }
    return this.auth.call({ query, variables, streamOptions, pull: 'linkUpsert' }, {
      invalidateAll: true
    })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation LinkDeleteById($id: ID) {
          linkDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'linkDeleteById'
    }, { invalidateAll: true })
  }

  getTrackerUrl = (link, { locationStr, router }) => {
    if (locationStr) {
      return `https://${router.getHost()}/l/${link?.slug}/${locationStr}`
    } else {
      return `https://${router.getHost()}/l/${link?.slug}`
    }
  }
}
