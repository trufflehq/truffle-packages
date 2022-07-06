const DEFAULT_FIELDS = 'id, slug, name, decimalPlaces'

export default class OrgUserCounterType {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query OrgUserCounterTypes {
          orgUserCounterTypes {
          nodes {
            ${DEFAULT_FIELDS}
          }
        }
      }`,
      pull: 'orgUserCounterTypes'
    })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query OrgUserCounterTypeById($id: ID) {
          orgUserCounterType(id: $id) {
            ${DEFAULT_FIELDS}
          }
        }`,
      variables: { id },
      pull: 'orgUserCounterType'
    })
  }

  getBySlug = (slug) => {
    return this.auth.stream({
      query: `
        query OrgUserCounterTypeBySlug($slug: String) {
          orgUserCounterType(slug: $slug) {
            ${DEFAULT_FIELDS}
          }
        }
      `,
      variables: {
        slug
      },
      pull: 'orgUserCounterType'
    })
  }

  upsert = ({ id, name, slug, decimalPlaces }) => {
    return this.auth.call({
      query: `
        mutation OrgUserCounterTypeUpsert(
          $id: ID
          $name: String
          $slug: String
          $decimalPlaces: Int
        ) {
          orgUserCounterTypeUpsert(id: $id, name: $name, slug: $slug, decimalPlaces: $decimalPlaces) { id }
        }`,
      variables: { id, name, slug, decimalPlaces },
      pull: 'orgUserCounterTypeUpsert'
    }, { invalidateAll: true })
  }
}
