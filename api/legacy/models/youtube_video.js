export default class YoutubeVideo {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAllByChannelId (id, { limit } = {}) {
    return this.auth.stream({
      query: `
        query YoutubeVideosByChannelId($id: String, $limit: Int) {
          youtubeVideosByChannelId(id: $id, limit: $limit) {
            nodes { url, title, date, description,
              thumbnails {
                default {
                  url
                }
                standard {
                  url
                }
                high {
                  url
                }
                medium {
                  url
                }
                maxres {
                  url
                }
              }
            }
          }
        }`,
      variables: { id, limit },
      pull: 'youtubeVideosByChannelId'
    })
  }

  getAllByPlaylistId (id, { limit } = {}) {
    return this.auth.stream({
      query: `
        query YoutubeVideosByPlaylistId($id: String, $limit: Int) {
          youtubeVideosByPlaylistId(id: $id, limit: $limit) {
            nodes { url, title, date, description,
              thumbnails {
                default {
                  url
                }
                standard {
                  url
                }
                high {
                  url
                }
                medium {
                  url
                }
                maxres {
                  url
                }
              }
            }
          }
        }`,
      variables: { id, limit },
      pull: 'youtubeVideosByPlaylistId'
    })
  }
}
