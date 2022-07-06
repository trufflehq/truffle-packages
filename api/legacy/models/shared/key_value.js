export default class KeyValue {
  constructor ({ auth }) {
    this.auth = auth
  }

  upsert = ({ sourceType, sourceId, key, value }) => {
    return this.auth.call({
      query: `
        mutation KeyValueUpsert(
          $sourceType: String
          $sourceId: String
          $key: String
          $value: String
        ) {
          keyValueUpsert(sourceType: $sourceType, sourceId: $sourceId, key: $key, value: $value) {
            key
            value
          }
        }`,
      variables: { sourceType, sourceId, key, value },
      pull: 'keyValueUpsert'
    }, { invalidateAll: true })
  }
}
