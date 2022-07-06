export default class Donation {
  constructor ({ auth }) {
    this.auth = auth

    this.celebratedDonationMessages = []
  }

  shouldCelebrateDonationMessage = (messageId) => {
    const hasCelebrated = this.celebratedDonationMessages.indexOf(messageId) !== -1
    if (!hasCelebrated) {
      this.celebratedDonationMessages.push(messageId)
    }
    return !hasCelebrated
  }

  create = ({ amountCents, message, stripeTokenId }) => {
    return this.auth.call({
      query: `
        mutation DonationCreate($amountCents: Int, $message: String, $stripeTokenId: String) {
          donationCreate(amountCents: $amountCents, message: $message, stripeTokenId: $stripeTokenId)
        }`,
      variables: { amountCents, message, stripeTokenId },
      pull: 'donationCreate'
    }, { invalidateAll: true })
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query Donations {
          donations {
            nodes { id, time, amountCents, message, user { name, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } } }
          }
        }`,
      // variables: {},
      pull: 'donations'
    })
  }
}
