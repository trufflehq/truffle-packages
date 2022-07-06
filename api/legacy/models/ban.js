export default class Ban {
  constructor ({ auth }) {
    this.auth = auth
  }

  upsert = ({ userId, duration, isIpBan }) => {
    return this.auth.call({
      query: `
        mutation BanUpsert(
          $userId: ID!
          $duration: String
          $isIpBan: Boolean
        ) {
          banUpsert(userId: $userId, duration: $duration, isIpBan: $isIpBan) {
            id
          }
        }
`,
      variables: { userId, duration, isIpBan },
      pull: 'banUpsert'
    }, { invalidateAll: true })
  }
}
