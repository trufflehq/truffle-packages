const DEFAULT_FIELDS = `
  id, slug, name, jsx, data
`

export default class Powerup {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = () => {
    return this.auth.stream({
      query: `query PowerupGetAll {
        powerups {
          nodes { ${DEFAULT_FIELDS} }
        }
      }`,
      pull: 'powerups'
    })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query PowerupById($id: ID) {
          powerup(id: $id) {
            ${DEFAULT_FIELDS}
          }
        }`,
      variables: { id },
      pull: 'powerup'
    })
  }

  upsert = ({ id, name, slug, jsx, data }) => {
    return this.auth.call({
      query: `
        mutation PowerupUpsert(
          $id: ID
          $name: String
          $slug: String
          $jsx: String
          $data: JSON
        ) {
          powerupUpsert(id: $id, name: $name, slug: $slug, jsx: $jsx, data: $data) { id }
        }`,
      variables: { id, name, slug, jsx, data },
      pull: 'powerupUpsert'
    }, { invalidateAll: true })
  }
}
