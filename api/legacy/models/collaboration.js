export default class Collaboration {
  constructor ({ auth, podcastEpisode }) {
    this.auth = auth
    this.podcastEpisode = podcastEpisode
  }

  getAllByCollaboratorId = (collaboratorId) => {
    return this.auth.stream({
      query: `
        query CollaborationGetAll($collaboratorId: ID) {
        collaborations(collaboratorId: $collaboratorId) {
          nodes {
            sourceType
            podcastEpisode { ${this.podcastEpisode.BASE_FIELDS} }
          }
        }
      }`,
      variables: { collaboratorId },
      pull: 'collaborations'
    })
  }
}
