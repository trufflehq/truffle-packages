export default class Role {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query Roles {
          roles {
            nodes { id, name, slug, permissions { nodes { id, filters, action, value } } }
          }
        }`,
      // variables: { orgId },
      pull: 'roles'
    })
  }

  upsert = ({ id, name, permissions }) => {
    return this.auth.call({
      query: `
        mutation RoleUpsert(
          $id: ID
          $name: String
          $permissions: JSON
        ) {
          roleUpsert(id: $id, name: $name, permissions: $permissions) {
            name
          }
        }
`,
      variables: { id, name, permissions },
      pull: 'role'
    }, { invalidateAll: true })
  }

  setRanks = (ids) => {
    return this.auth.call({
      query: `
        mutation RoleSetRanks(
          $ids: [ID]
        ) {
          roleSetRanks(ids: $ids)
        }`,
      variables: { ids },
      pull: 'role'
    }, { invalidateAll: true })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation RoleDeleteById($id: ID) {
          roleDeleteById(id: $id)
        }
`,
      variables: { id },
      pull: 'roleDeleteById'
    }, { invalidateAll: true })
  }
}
