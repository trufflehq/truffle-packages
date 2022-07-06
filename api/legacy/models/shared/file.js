export default class File {
  constructor ({ auth, apiUrl, graphqlClient, proxy }) {
    this.auth = auth
    this.apiUrl = apiUrl
    this.graphqlClient = graphqlClient
    this.proxy = proxy
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query File($id: ID) {
          file(id: $id) {
            signedUrl
          }
        }`,
      variables: { id },
      pull: 'file'
    })
  }

  upload = (file, { onProgress } = {}) => {
    const formData = new FormData()
    formData.append('file', file, file.name)
    return this.proxy(this.apiUrl + '/upload', {
      method: 'POST',
      beforeSend (xhr) {
        // if this isn't working, it might be serviceworker's fault
        if (onProgress) {
          return xhr.upload.addEventListener('progress', onProgress, false)
        }
      },
      query: {
        graphqlQuery: `
          mutation FileUpload {
            fileUpload {
              id, cdn, data, prefix, ext, contentType, type, variations
            }
          }`
      },
      body: formData
    })
  }
}
