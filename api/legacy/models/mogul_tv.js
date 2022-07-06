export default class MogulTv {
  constructor ({ auth, graphqlClient }) {
    this.auth = auth
    this.graphqlClient = graphqlClient
  }

  getMogulTvUser = (token) => {
    return this.auth.stream({
      query: `
        query MogulTvUser($token: String) {
          mogulTvUser(token: $token) {
            sub
            name
          }
        }`,
      variables: {
        token
      },
      pull: 'mogulTvUser'
    })
  }

  signInWithMogulTvJwt = async (token, { isTransfer } = {}) => {
    const mogulTvUser = await this.auth.call({
      query: `
        mutation MogulTvSignIn($token: String, $isTransfer: Boolean) {
          mogulTvSignIn(token: $token, isTransfer: $isTransfer) {
            sub, name, truffleAccessToken
          }
        }
      `,
      variables: {
        token,
        isTransfer
      },
      pull: 'mogulTvSignIn'
    }, { invalidateAll: false })

    if (mogulTvUser?.truffleAccessToken) {
      this.auth.setAccessToken(mogulTvUser.truffleAccessToken)

      this.auth.getMe()

      this.graphqlClient.invalidateAll()
    }
    return mogulTvUser
  }
}
