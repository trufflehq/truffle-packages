export default class PushToken {
  constructor ({ auth, tokenStream }) {
    this.auth = auth
    this.tokenStream = tokenStream
  }

  upsert = ({ tokenStr, sourceType, deviceId, appKey } = {}) => {
    console.log('upsert', tokenStr, sourceType, deviceId)
    return this.auth.call({
      query: `
        mutation PushTokenUpsert(
          $tokenStr: String
          $sourceType: String
          $deviceId: String
          $appKey: String
        ) {
          pushTokenUpsert(tokenStr: $tokenStr, sourceType: $sourceType, deviceId: $deviceId, appKey: $appKey) {
            sourceType
          }
        }
`,
      variables: { tokenStr, sourceType, deviceId, appKey },
      pull: 'pushTokenUpsert'
    }, { invalidateAll: true })
  }

  setCurrentPushToken = (token) => {
    return this.tokenStream.next(token)
  }

  getCurrentPushToken = () => {
    return this.tokenStream
  }
}
