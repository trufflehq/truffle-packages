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
            componentInstanceId
            componentInstances {
              id # req for cache categoryFn
              component {
                id # req for cache categoryFn
                module { url }
              } 
            }
            routerId
            routers {
              id # req for cache categoryFn
              parentId
              componentInstance {
                id # req for cache categoryFn
                component {
                  id # req for cache categoryFn
                  module { url }
                } 
              }
            }
          }
        }`,
      variables: { packageVersionId, path },
      pull: 'route'
    }, { isErrorable: true })
  }
}
