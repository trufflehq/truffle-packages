export default class PodcastEpisode {
  constructor ({ auth }) {
    this.auth = auth
  }

  BASE_FIELDS = `id
    slug
    time
    title
    description
    durationSeconds
    transcript
    media
    imageFileRel {
      fileObj { cdn, prefix, data, variations, ext }
    }`

  SINGLE_FIELDS = 'collaboratorRels { collaborator { id, slug, name, oneLiner, bio, imageFileRel { fileObj { cdn, prefix, data, variations, ext } } } }'

  getAllByPodcastId = (podcastId) => {
    return this.auth.stream({
      query: `
        query PodcastEpisodesGetAllByPodcastId($podcastId: ID) {
          podcastEpisodes(podcastId: $podcastId) {
            nodes { ${this.BASE_FIELDS} }
          }
        }`,
      variables: { podcastId },
      pull: 'podcastEpisodes'
    })
  }

  getByPodcastSlugAndSlug = (podcastSlug, slug) => {
    return this.auth.stream({
      query: `
        query PodcastEpisodeGetByPodcastSlugAndSlug(
          $podcastSlug: String
          $slug: String
        ) {
          podcastEpisode(podcastSlug: $podcastSlug, slug: $slug) {
            ${this.BASE_FIELDS}
            videoUrl
            notes
            transcript
            collaboratorRels { collaborator { id, slug, name, oneLiner, bio, imageFileRel { fileObj { cdn, prefix, data, variations, ext } } } }
          }
        }`,
      variables: { podcastSlug, slug },
      pull: 'podcastEpisode'
    })
  }

  upsert = ({ id, videoUrl, notes, transcript, collaboratorRels }) => {
    return this.auth.call({
      query: `
        mutation PodcastEpisodeUpsert(
          $id: ID
          $videoUrl: String
          $notes: String
          $transcript: String
          $collaboratorRels: JSON
        ) {
          podcastEpisodeUpsert(id: $id, videoUrl: $videoUrl, notes: $notes, transcript: $transcript, collaboratorRels: $collaboratorRels) {
            id
          }
        }
`,
      variables: { id, videoUrl, notes, transcript, collaboratorRels },
      pull: 'podcastEpisode'
    }, { invalidateAll: true })
  }
}
