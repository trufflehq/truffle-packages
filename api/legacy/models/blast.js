export default class Blast {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = ({ minStartTime, maxStartTime } = {}) => {
    return this.auth.stream({
      query: `
        query Blasts(
          $minStartTime: Date
          $maxStartTime: Date
        ) {
          blasts(minStartTime: $minStartTime, maxStartTime: $maxStartTime) {
            nodes { id, emailSubject, emailBody, smsText, time }
          }
        }`,
      variables: { minStartTime, maxStartTime },
      pull: 'blasts'
    })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation BlastDeleteById($id: ID) {
          blastDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'blastDeleteById'
    }, { invalidateAll: true })
  }

  create = ({ contactMethods, filters, emailSubject, emailBody, smsText }) => {
    return this.auth.call({
      query: `
        mutation BlastCreate(
          $contactMethods: [BlastContactMethodEnum]
          $filters: JSON
          $emailSubject: String
          $emailBody: String
          $smsText: String
        ) {
          blastCreate(filters: $filters, contactMethods: $contactMethods, emailSubject: $emailSubject, emailBody: $emailBody, smsText: $smsText) { id }
        }`,
      variables: { contactMethods, filters, emailSubject, emailBody, smsText },
      pull: 'blastCreate'
    }, { invalidateAll: true })
  }

  sendTest = ({ emailPhone, contactMethods, filters, emailSubject, emailBody, smsText }) => {
    const { email, phone } = this.auth.parseEmailPhone(emailPhone)
    return this.auth.call({
      query: `
        mutation BlastSendTest(
          $email: String
          $phone: String
          $contactMethods: [BlastContactMethodEnum]
          $filters: JSON
          $emailSubject: String
          $emailBody: String
          $smsText: String
        ) {
          blastSendTest(email: $email, phone: $phone, filters: $filters, contactMethods: $contactMethods, emailSubject: $emailSubject, emailBody: $emailBody, smsText: $smsText)
        }`,
      variables: { email, phone, contactMethods, filters, emailSubject, emailBody, smsText },
      pull: 'blastSendTest'
    }, { invalidateAll: true })
  }
}
