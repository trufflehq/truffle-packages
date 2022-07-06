export default class LegacyOrgUserCounterType {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query LegacyOrgUserCounterTypes {
          legacyOrgUserCounterTypes {
          nodes {
            id
            slug
            name
          }
        }
      }`,
      pull: 'legacyOrgUserCounterTypes'
    })
  }
}
