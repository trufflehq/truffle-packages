export default class LoginLink {
  constructor ({ auth }) {
    this.auth = auth
  }

  getByUserIdAndtokenStr = (userId, tokenStr) => {
    return this.auth.stream({
      query: `
        query LoginLinkGetByUserIdAndtokenStr($userId: ID!, $tokenStr: String!) {
          loginLink(userId: $userId, tokenStr: $tokenStr) { data }
        }`,
      variables: { userId, tokenStr }
    })
  }
}
