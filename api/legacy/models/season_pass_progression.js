export default class SeasonPassProgression {
  constructor ({ auth }) {
    this.auth = auth
  }

  upsert = ({ id, tierNum }) => {
    return this.auth.call({
      query: `
        mutation SeasonPassProgressionUpsert(
          $id: ID
          $tierNum: Int
        ) {
          seasonPassProgressionUpsert(id: $id, tierNum: $tierNum) { id }
        }`,
      variables: { id, tierNum },
      pull: 'seasonPassProgressionUpsert'
    }, { invalidateAll: true })
  }
}
