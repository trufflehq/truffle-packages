export default class RssFeedItem {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAllByUrl (url, { limit } = {}) {
    return this.auth.stream({
      query: `
        query RssFeedItemGetAllByUrl($url: String, $limit: Int) {
          rssFeedItems(url: $url, limit: $limit) {
            nodes { date, title, description, imageUrl, url }
          }
        }`,
      variables: { url, limit },
      pull: 'rssFeedItems'
    })
  }
}
