import { FRAGMENT_PAGE_WITH_EXTRAS, FRAGMENT_COMPONENT_INSTANCE_FIELDS_ADMIN } from '../constants.js'

export default class Page {
  constructor ({ auth, proxy, apiUrl, graphqlClient, org }) {
    this.auth = auth
    this.proxy = proxy
    this.apiUrl = apiUrl
    this.graphqlClient = graphqlClient
    this.org = org
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query Pages {
          pages {
            nodes { id, slug, title }
          }
        }`,
      // variables: {},
      pull: 'pages'
    })
  }

  getByPackageVersionIdAndSlugAdmin = (packageVersionId, slug) => {
    return this.auth.stream({
      query: `
        query getByPackageVersionIdAndSlugAdmin($packageVersionId: ID, $slug: String) {
          page(packageVersionId: $packageVersionId, slug: $slug) {
            id
            title
            slug
            routeConnection {
              nodes {
                id
                pathWithVariables
              }
            }
            componentInstanceId
            componentInstances { ...componentInstanceFieldsAdmin }
          }
        } ${FRAGMENT_COMPONENT_INSTANCE_FIELDS_ADMIN}`,
      variables: { packageVersionId, slug },
      pull: 'page'
    })
  }

  getByPackageVersionSlug = (slug) => {
    return this.auth.stream({
      query: `
        query CacheablePageWithExtras($slug: String) {
          page(slug: $slug) {
            ...pageWithExtras
          }
        } ${FRAGMENT_PAGE_WITH_EXTRAS}`,
      variables: { slug },
      pull: 'page'
    }, { isErrorable: true })
  }

  // only one of slug or routePath req
  getMembershipTierIdsWithPermission = ({ slug, routePath }) => {
    const page = this.auth.stream({
      query: `
        query PageGetMembershipTierIdsWithPermission($slug: String, $routePath: String) {
          page(slug: $slug, routePath: $routePath) {
            membershipTierIds
          }
        }`,
      variables: { slug, routePath },
      pull: 'page'
    })
    return page?.membershipTierIds
  }

  changeComponentId = async ({ id, componentId }) => {
    const res = await this.auth.call({
      query: `
        mutation PageChangeComponentId($id: ID, $componentId: ID) {
          pageChangeComponentId(id: $id, componentId: $componentId) {
            id
          }
        }`,
      variables: { id, componentId },
      pull: 'pageChangeComponentId'
    }, { invalidateAll: false }) // done separately

    // orgConfig can change w/ this req
    this.org.invalidateGetMeThenAll()

    return res
  }

  upsert = async ({ id, packageVersionId, title, routePathWithVariables, componentId }) => {
    return this.auth.call({
      query: `
        mutation PageUpsert($id: ID, $packageVersionId: ID, $title: String, $routePathWithVariables: String, $componentId: ID) {
          pageUpsert(id: $id, packageVersionId: $packageVersionId, title: $title, routePathWithVariables: $routePathWithVariables, componentId: $componentId) {
            id, slug
          }
        }`,
      variables: { id, packageVersionId, title, routePathWithVariables, componentId },
      pull: 'pageUpsert'
    }, { invalidateAll: true })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation PageDeleteById($id: ID) {
          pageDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'pageDeleteById'
    }, { invalidateAll: true })
  }
}
