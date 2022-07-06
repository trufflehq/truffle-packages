const FIELDS = `
  author { name, username, profilePic }
  id, text, retweetCount, likeCount, createdAt
  media { width, height, url }
  quotedTweet { author { name, username, profilePic }, text }
`

export default class Tweet {
  constructor ({ auth }) {
    this.auth = auth
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query Tweet($id: String) {
          tweet(id: $id) {
            ${FIELDS}
          }
        }`,
      variables: { id },
      pull: 'tweet'
    })
  }

  getAllByIds = (ids) => {
    return this.auth.stream({
      query: `
        query TwitterGetAllByIds($ids: [String]) {
          tweets(ids: $ids) {
            nodes { ${FIELDS} }
          }
        }`,
      variables: { ids },
      pull: 'tweets'
    })
  }

  getAllByTwitterUsername = (twitterUsername) => {
    return this.auth.stream({
      query: `
        query TwitterGetAllByTwitterUsername($twitterUsername: String) {
          tweets(twitterUsername: $twitterUsername) {
            nodes { ${FIELDS} }
          }
        }`,
      variables: { twitterUsername },
      pull: 'tweets'
    })
  }
}
