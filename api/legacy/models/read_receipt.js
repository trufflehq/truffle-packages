import { createSubject } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'

export default class ReadReceipt {
  constructor ({ auth }) {
    this.auth = auth
    // { <sourceId>: true }
    this.localCacheStream = createSubject({}, { shouldPersist: true })
  }

  getBySourceTypeAndSourceId = (sourceType, sourceId) => {
    return this.auth.stream({
      query: `
        query ReadReceiptBySourceTypeAndSourceId($sourceType: String, $sourceId: ID) {
          readReceipt(sourceType: $sourceType, sourceId: $sourceId) {
            id
          }
        }`,
      variables: { sourceType, sourceId },
      pull: 'readReceipt'
    })
  }

  getLocalCacheStream = () => {
    return this.localCacheStream
  }

  upsert = ({ sourceType, sourceId }, { shouldAddToLocalCache } = {}) => {
    if (shouldAddToLocalCache) {
      this.localCacheStream.next({
        ...this.localCacheStream.getValue(),
        [sourceId]: true
      })
    }

    return this.auth.call({
      query: `
        mutation ReadReceiptUpsert(
          $sourceType: String
          $sourceId: ID
        ) {
          readReceiptUpsert(sourceType: $sourceType, sourceId: $sourceId)
        }`,
      variables: { sourceType, sourceId },
      pull: 'readReceiptUpsert'
    }, { invalidateAll: false })
  }
}
