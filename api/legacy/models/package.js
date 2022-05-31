export default class Package {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = () => {
    return this.auth.stream({
      query: `query PackageGetAll {
        packageConnection {
          nodes {
            name
            latestPackageVersionId
          }
        }
      }`,
      // variables: {},
      pull: 'packageConnection'
    })
  }
}
