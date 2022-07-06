export default class Podcast {
  constructor ({ auth }) {
    this.auth = auth
  }

  getBySlug = (slug) => {
    return this.auth.stream({
      query: `
        query PodcastBySlug($slug: String) {
          podcast(slug: $slug) {
            id, name, description, links { site, url }
          }
        }`,
      variables: { slug },
      pull: 'podcast'
    })
  }
}
