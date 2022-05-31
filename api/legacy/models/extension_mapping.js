export default class ExtensionMapping {
  constructor ({ auth }) {
    this.auth = auth
  }

  getByComponentInstanceId = (componentInstanceId) => {
    return this.auth.stream({
      query: `
        query ExtensionMappingByComponentInstanceId($componentInstanceId: ID) {
          extensionMapping(componentInstanceId: $componentInstanceId) {
            id
            slug
            defaultLayoutConfigSteps { action, value }
            sourceType
            status
          }
        }
      `,
      variables: {
        componentInstanceId
      },
      pull: 'extensionMapping'
    })
  }

  upsert = (slug, defaultLayoutConfigSteps, sourceType, componentInstanceId, status) => {
    return this.auth.call({
      query: `
        mutation ExtensionMappingUpsert($slug: String!, $defaultLayoutConfigSteps: JSON!, $sourceType: String!, $componentInstanceId: ID!, $status: String) {
          extensionMappingUpsert(slug: $slug, defaultLayoutConfigSteps: $defaultLayoutConfigSteps, sourceType: $sourceType, componentInstanceId: $componentInstanceId, status: $status) {
            id
          }
        }
      `,
      variables: {
        slug,
        defaultLayoutConfigSteps,
        sourceType,
        componentInstanceId,
        status
      },
      pull: 'extensionMappingUpsert'
    }, { invalidateAll: true })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation DeleteExtensionMapping($id: ID) {
          deleteExtensionMapping(id: $id)
        }
      `,
      variables: {
        id
      },
      pull: 'deleteExtensionMapping'
    }, { invalidateAll: true })
  }
}
