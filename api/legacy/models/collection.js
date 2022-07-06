export default class Collection {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAllByMe = () => {
    return this.auth.stream({
      query: `
        query CollectionByUserId {
          collections {
            nodes {
              id
              devOrgId
              name
              slug
            }
          }
        }
      `,
      pull: 'collections'
    })
  }

  getBySlug = (slug) => {
    return this.auth.stream({
      query: `
        query CollectionBySlug($slug: String) {
          collection(slug: $slug) {
            id
            devOrgId
            name
            slug
          }
        }
      `,
      variables: { slug },
      pull: 'collection'
    })
  }

  upsert = async ({ id, name }) => {
    return this.auth.call({
      query: `
        mutation CollectionUpsert(
          $id: ID,
          $name: String
        ) {
          collectionUpsert(id: $id, name: $name) {
            id
            devOrgId
            name
            slug
          }
        }
      `,
      variables: { id, name },
      pull: 'collectionUpsert'
    }, { invalidateAll: true })
  }
}
