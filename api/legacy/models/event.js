export default class Event {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = ({ minStartTime, maxStartTime } = {}) => {
    return this.auth.stream({
      query: `
        query Events(
          $minStartTime: Date
          $maxStartTime: Date
        ) {
          events(minStartTime: $minStartTime, maxStartTime: $maxStartTime) {
            nodes { id, name, description, startTime, data, slug, sourceId }
          }
        }`,
      variables: { minStartTime, maxStartTime },
      pull: 'events'
    })
  }

  getBySlug = (slug) => {
    return this.auth.stream({
      query: `
        query EventBySlug($slug: String) {
          event(slug: $slug) {
            id, name, description, startTime, endTime, data, slug
          }
        }`,
      variables: { slug },
      pull: 'event'
    })
  }

  getIsLive = (event, { bufferMs = 0 } = {}) => {
    return event?.startTime && new Date(event?.startTime) < Date.now() + bufferMs
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation EventDeleteById($id: ID) {
          eventDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'eventDeleteById'
    }, { invalidateAll: true })
  }

  createByClubhouseUrl = (clubhouseUrl) => {
    return this.auth.call({
      query: `
        mutation EventCreateByClubhouseUrl(
          $clubhouseUrl: String!
        ) {
          eventCreateByClubhouseUrl(clubhouseUrl: $clubhouseUrl)
        }`,
      variables: { clubhouseUrl },
      pull: 'createByClubhouseUrl'
    }, { invalidateAll: true })
  }
}
