export default class Component {
  constructor ({ auth, localCache }) {
    this.auth = auth
    this.localCache = localCache
  }

  getCachedComponentById (id) {
    return this.localCache?.components?.[id]
  }

  getAll = ({ type, shouldFetchByDevOrgId, status = 'published' } = {}) => {
    return this.auth.stream({
      query: `
        query ComponentsGetAll($type: String, $status: String, $shouldFetchByDevOrgId: Boolean) {
        components(type: $type, status: $status, shouldFetchByDevOrgId: $shouldFetchByDevOrgId) {
          nodes {
            id
            slug
            name
            type
            data
          }
        }
      }`,
      variables: { type, status, shouldFetchByDevOrgId },
      pull: 'components'
    })
  }

  getAllByCollection = ({ sourceId }) => {
    return this.auth.stream({
      query: `
        query ComponentGetAllByCollection($sourceId: ID) {
          components(sourceId: $sourceId) {
            nodes {
              id
              slug
              name
              type
              data
            }
          }
        }`,
      variables: { sourceId },
      pull: 'components'
    })
  }

  upsert = async ({ id, slug, childComponentConfigs, sass, sassMixins, jsx, componentInstanceId, propTypes }) => {
    return this.auth.call({
      query: `
      mutation ComponentUpsert(
        $id: ID
        $slug: String
        $componentInstanceId: ID
        $childComponentConfigs: JSON
        $sass: String
        $sassMixins: String
        $jsx: String
        $propTypes: JSON
      ) {
        componentUpsert(
          id: $id
          slug: $slug
          componentInstanceId: $componentInstanceId
          childComponentConfigs: $childComponentConfigs
          sass: $sass
          sassMixins: $sassMixins
          jsx: $jsx
          propTypes: $propTypes
        ) {
          id
          name
          slug
        }
      }
      `,
      variables: { id, slug, componentInstanceId, childComponentConfigs, sass, sassMixins, jsx, propTypes },
      pull: 'componentUpsert'
    }, { invalidateAll: true })
  }

  fork = async ({ fromId, componentInstanceId, collectionId, name }) => {
    return this.auth.call({
      query: `mutation ComponentForkByIdAndComponentInstanceId(
        $fromId: ID!
        $componentInstanceId: ID!
        $collectionId: ID!
        $name: String
      ) {
        componentFork(
          fromId: $fromId
          componentInstanceId: $componentInstanceId
          collectionId: $collectionId
          name: $name
        ) { id }
      }
      `,
      variables: { fromId, componentInstanceId, collectionId, name },
      pull: 'componentFork'
    }, { invalidateAll: true })
  }
}
