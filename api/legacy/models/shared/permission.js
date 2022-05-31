export default class Permission {
  constructor ({ auth }) {
    this.auth = auth
  }

  getByFilters = (filters) => {
    return this.auth.stream({
      query: `
        query Permissions($filters: JSON) {
          permissions(filters: $filters) {
            nodes { id, action, value, filters, roleId, role { id, name } }
          }
        }`,
      variables: { filters },
      pull: 'permissions'
    })
  }

  deleteAllByFilters = (filters) => {
    return this.auth.call({
      query: `
        mutation PermissionDeleteAllByFilters(
          $filters: JSON
        ) {
          permissionDeleteAllByFilters(filters: $filters)
        }
      `,
      variables: { filters },
      pull: 'permissionDeleteAllByFilters'
    }, { invalidateAll: true })
  }

  batchUpsert = (permissions) => {
    return this.auth.call({
      query: `
        mutation PermissionBatchUpsert(
          $permissions: JSON
        ) {
          permissionBatchUpsert(permissions: $permissions)
        }
      `,
      variables: { permissions },
      pull: 'permission'
    }, { invalidateAll: true })
  }

  upsert = ({ roleId, sourceType, sourceId, permission, value }) => {
    return this.auth.call({
      query: `
        mutation PermissionUpsert(
          $roleId: ID
          $sourceType: String
          $sourceId: ID
          $permission: String
          $value: Boolean
        ) {
          permissionUpsert(roleId: $roleId, sourceType: $sourceType, sourceId: $sourceId, permission: $permission, value: $value) {
            roleId
          }
        }
`,
      variables: { roleId, sourceType, sourceId, permission, value },
      pull: 'permission'
    }, { invalidateAll: true })
  }
}
