export default class OrgUserInvite {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query OrgUserInviteGetAll {
          orgUserInvites {
            nodes {
              id
              name
              email
              orgId
              roleIds
              roles { nodes { id, name } }
            }
          }
        }
`,
      // variables: {},
      pull: 'orgUserInvites'
    })
  }

  getByTokenStr = (tokenStr) => {
    return this.auth.stream({
      query: `
        query OrgUserInviteGetByTokenStr($tokenStr: String) {
          orgUserInvite(tokenStr: $tokenStr) { id }
        }
`,
      variables: { tokenStr },
      pull: 'orgUserInvite'
    })
  }

  upsert = ({ id, email, name, roleIds }) => {
    return this.auth.call({
      query: `
        mutation OrgUserInviteUpsert(
          $id: ID
          $email: String
          $name: String
          $roleIds: [ID]
        ) {
          orgUserInviteUpsert(id: $id, email: $email, name: $name, roleIds: $roleIds) {
            tokenStr
          }
        }
`,
      variables: { id, email, name, roleIds },
      pull: 'orgUserInviteUpsert'
    }, { invalidateAll: true })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation OrgUserInviteDeleteById($id: ID) {
          orgUserInviteDeleteById(id: $id)
        }
`,
      variables: { id },
      pull: 'orgUserInviteDeleteById'
    }, { invalidateAll: true })
  }
}
