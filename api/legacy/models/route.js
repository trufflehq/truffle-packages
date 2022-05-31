import { FRAGMENT_PAGE_WITH_EXTRAS } from '../constants.js'

export default class Route {
  constructor ({ auth }) {
    this.auth = auth
  }

  getByPackageVersionIdAndPath = (packageVersionId, path) => {
    console.log('route', packageVersionId, path)
    return this.auth.stream({
      query: `
        query CacheableRouteWithExtras($packageVersionId: ID, $path: String) {
          route(packageVersionId: $packageVersionId, path: $path) {
            id # req for cache categoryFn
            pathWithVariables
            page {
              ...pageWithExtras
            }
          }
        } ${FRAGMENT_PAGE_WITH_EXTRAS}`,
      variables: { packageVersionId, path },
      pull: 'route'
    }, { isErrorable: true })
  }
}
