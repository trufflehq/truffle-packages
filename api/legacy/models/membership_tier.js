export default class MembershipTier {
  constructor ({ auth, proxy, apiUrl, graphqlClient }) {
    this.auth = auth
    this.proxy = proxy
    this.apiUrl = apiUrl
    this.graphqlClient = graphqlClient
  }

  getAllAdmin = () => {
    return this.auth.stream({
      query: `
        query MembershipTiers {
          membershipTiers {
            nodes {
              id, slug, name, description, priceCents, subscriptionInterval, roleId, activeMembershipCount
              imageFileRel { fileObj { cdn, prefix, data, variations, ext } }
            }
          }
        }`,
      // variables: {},
      pull: 'membershipTiers'
    })
  }

  // withPermissionTo: { fitlers } optional
  getAll = ({ withPermissionTo } = {}) => {
    return this.auth.stream({
      query: `
        query MembershipTiers($withPermissionTo: JSON) {
          membershipTiers(withPermissionTo: $withPermissionTo) {
            nodes {
              id, slug, name, description, priceCents, subscriptionInterval, roleId
              imageFileRel { fileObj { cdn, prefix, data, variations, ext } }
              membership { isActive }
            }
          }
        }`,
      variables: { withPermissionTo },
      pull: 'membershipTiers'
    })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query MembershipTierById($id: ID!) {
          membershipTier(id: $id) {
            id, slug, name, priceCents, subscriptionInterval
          }
        }`,
      variables: { id },
      pull: 'membershipTier'
    })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation MembershipTierDeleteById($id: ID) {
          membershipTierDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'membershipTierDeleteById'
    }, { invalidateAll: true })
  }

  upsert = async ({ id, name, description, priceCents }, { file } = {}) => {
    const query = `
      mutation MembershipTierCreate(
        $id: ID
        $name: String
        $description: String
        $priceCents: Int
      ) {
        membershipTierUpsert(id: $id, name: $name, description: $description, priceCents: $priceCents) { id }
      }`
    const variables = { id, name, description, priceCents }

    if (file) {
      const formData = new FormData()
      formData.append('file', file, file.name)

      const response = await this.proxy(this.apiUrl + '/upload', {
        method: 'POST',
        query: {
          graphqlQuery: query,
          variables: JSON.stringify(variables)
        },
        body: formData
      })
      setTimeout(this.graphqlClient.invalidateAll, 0)
      return response
    } else {
      return this.auth.call({
        query, variables
      }, { invalidateAll: true })
    }
  }
}
