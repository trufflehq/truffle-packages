export default class Collectible {
  constructor ({ auth, proxy, apiUrl, graphqlClient }) {
    this.auth = auth
    this.proxy = proxy
    this.apiUrl = apiUrl
    this.graphqlClient = graphqlClient
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query CollectibleById($id: ID) {
          collectible(id: $id) {
            id, slug, name, type
            fileRel { fileObj { cdn, prefix, data, variations, ext } }
            data {
              category
              redeemType
              redeemButtonText
              redeemData
              description
            }
          }
        }`,
      variables: { id },
      pull: 'collectible'
    })
  }

  getAllByMe = ({ type, targetType } = {}) => {
    return this.auth.stream({
      query: `
        query CollectibleGetAllByMe($type: String, $targetType: String) {
          collectibles(isMe: true, type: $type, targetType: $targetType) {
            nodes {
              id
              slug
              fileRel { fileObj { cdn, prefix, data, variations, ext } }
              name
              type
              targetType
              ownedCollectible { count }
              data {
                description
                redeemType
                redeemData
                redeemButtonText
              }
            }
          }
        }`,
      variables: { type, targetType },
      pull: 'collectibles'
    })
  }

  upsert = async ({ id, slug, name, type, data }, { file } = {}) => {
    const query = `
      mutation CollectibleUpsert(
        $id: ID
        $slug: String
        $name: String
        $type: String
        $data: JSON
      ) {
        collectibleUpsert(id: $id, slug: $slug, name: $name, type: $type, data: $data) { id }
      }`
    const variables = { id, slug, name, type, data }

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
