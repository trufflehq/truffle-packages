export default class Membership {
  constructor ({ auth }) {
    this.auth = auth
  }

  // getAllByMeAndMeOrg = () => {
  //   return this.auth.stream({
  //     query: `query MembershipGetAllByMeAndMeOrg {
  //       memberships {
  //         nodes { userId, membershipTierId }
  //       }
  //     }`,
  //     pull: 'memberships'
  //   }, { isStreamed: true })
  // }

  purchase = (options) => {
    const { membershipTierId, amountCents, stripeTokenId } = options

    console.log('ppp', options)

    return this.auth.call({
      query: `
        mutation MembershipPurchase(
          $membershipTierId: ID
          $amountCents: Int
          $stripeTokenId: String
        ) {
          membershipPurchase(
            membershipTierId: $membershipTierId
            amountCents: $amountCents
            stripeTokenId: $stripeTokenId
          )
        }`,
      variables: {
        membershipTierId,
        amountCents,
        stripeTokenId
      },
      pull: 'membershipPurchase'
    }, { invalidateAll: true })
  }
}
