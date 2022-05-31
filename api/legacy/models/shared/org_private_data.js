export default class OrgPrivateData {
  constructor ({ auth }) {
    this.auth = auth
  }

  // uses orgSlug automatically
  getMe = () => {
    return this.auth.stream({
      query: `
        query OrgPrivateData {
          orgPrivateData {
            balanceCents,
            shopifyAccessCode
          }
        }`,
      // variables: {},
      pull: 'orgPrivateData'
    })
  }

  incrementMeBalance = async ({ stripeTokenId, amountCents }) => {
    return this.auth.call({
      query: `
        mutation OrgPrivateDataIncrementMeBalance(
          $stripeTokenId: String
          $amountCents: Int
        ) {
          orgPrivateDataIncrementMeBalance(stripeTokenId: $stripeTokenId, amountCents: $amountCents) {
            balanceCents
          }
        }`,
      variables: { stripeTokenId, amountCents },
      pull: 'orgPrivateDataIncrementMeBalance'
    }, { invalidateAll: true })
  }

  updateShopifyShopAccessCode = async ({ accessCode }) => {
    return this.auth.call({
      query: `
        mutation OrgPrivateDataUpdateShopifyAccessCode($accessCode: String) {
          orgPrivateDataUpdateShopifyAccessCode(accessCode: $accessCode) {
            shopifyAccessCode
          }
        }
      `,
      variables: { accessCode },
      pull: 'orgPrivateDataUpdateShopifyAccessCode'
    }, { invalidateAll: true })
  }
}
