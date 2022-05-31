const FIELDS = `
  id
`

export default class TiktokVideo {
  constructor ({ auth }) {
    this.auth = auth
  }

  getRecentByTiktokUsername = (tiktokUsername) => {
    return this.auth.stream({
      query: `
        query TiktokGetAllByTiktokUsername($tiktokUsername: String) {
          tiktokVideo(tiktokUsername: $tiktokUsername) {
            ${FIELDS}
          }
        }`,
      variables: { tiktokUsername },
      pull: 'tiktokVideo'
    })
  }
}
