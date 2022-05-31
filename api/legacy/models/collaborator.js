export default class Collaborator {
  constructor ({ auth, proxy, apiUrl, graphqlClient }) {
    this.auth = auth
    this.proxy = proxy
    this.apiUrl = apiUrl
    this.graphqlClient = graphqlClient
  }

  getBySlug = (slug) => {
    return this.auth.stream({
      query: `
        query CollaboratorGetBySlug($slug: String) {
        collaborator(slug: $slug) {
          id
          slug
          name
          oneLiner
          bio
          imageFileRel { fileObj { cdn, prefix, data, variations, ext } }
        }
      }`,
      variables: { slug },
      pull: 'collaborator'
    })
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query CollaboratorGetAll {
        collaborators {
          nodes {
            id
            slug
            name
            oneLiner
            bio
            imageFileRel { fileObj { cdn, prefix, data, variations, ext } }
          }
        }
      }`,
      // variables: {},
      pull: 'collaborators'
    })
  }

  searchByName = (nameQueryStr) => {
    return this.auth.stream({
      query: `
        query CollaboratorSearchByName($nameQueryStr: String) {
          collaborators(nameQueryStr: $nameQueryStr) {
            nodes {
              id
              slug
              name
              oneLiner
              bio
              imageFileRel { fileObj { cdn, prefix, data, variations, ext } }
            }
          }
        }`,
      variables: { nameQueryStr },
      pull: 'collaborators'
    })
  }

  upsert = async ({ id, name, oneLiner, bio, socials }, { file } = {}) => {
    console.log('save', file)
    const query = `
      mutation CollaboratorUpsert(
        $id: ID
        $name: String
        $oneLiner: String
        $bio: String
        $socials: JSON
      ) {
        collaboratorUpsert(id: $id, name: $name, oneLiner: $oneLiner, bio: $bio, socials: $socials) {
          id
        }
      }`
    const variables = { id, name, oneLiner, bio, socials }
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
      // this (graphqlClient.update) doesn't actually work... it'd be nice
      // but it doesn't update existing streams
      // .then @graphqlClient.update
      setTimeout(this.graphqlClient.invalidateAll, 0)
      return response
    } else {
      return this.auth.call({
        query, variables
      }, { invalidateAll: true })
    }
  }
}
