export default class PhoneNumber {
  constructor ({ auth, org }) {
    this.auth = auth
    this.org = org
  }

  getAllSearchPhoneNumbersByNumberQueryStr = (numberQueryStr) => {
    return this.auth.stream({
      query: `
        query SearchPhoneNumbersGetAllByNumberQueryStr(
          $numberQueryStr: String
        ) {
          searchPhoneNumbers(numberQueryStr: $numberQueryStr) {
            nodes {
              number, formattedNumber, locality, region, priceCents
            }
          }
        }`,
      variables: { numberQueryStr },
      pull: 'searchPhoneNumbers'
    })
  }

  purchase = async (options) => {
    const {
      number, amountCents, stripeTokenId
    } = options

    const res = await this.auth.call({
      query: `
        mutation PhoneNumberPurchase(
          $number: String
          $amountCents: Int
          $stripeTokenId: String
        ) {
          phoneNumberPurchase(
            number: $number
            amountCents: $amountCents
            stripeTokenId: $stripeTokenId
          )
        }`,
      variables: {
        number,
        amountCents,
        stripeTokenId,
        name
      },
      pull: 'phoneNumberPurchase'
    }, { invalidateAll: false }) // done separately

    this.org.invalidateGetMeThenAll()

    return res
  }
}
