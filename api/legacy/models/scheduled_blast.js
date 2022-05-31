export default class ScheduledBlast {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query ScheduledBlasts {
          scheduledBlasts {
            nodes { id, triggerSlug, contactMethods, emailSubject, emailBody, smsText }
          }
        }`,
      // variables: {},
      pull: 'scheduledBlasts'
    })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query ScheduledBlastById($id: ID!) {
          scheduledBlast(id: $id) {
            id, triggerSlug, contactMethods, filters, emailSubject, emailBody, smsText
          }
        }`,
      variables: { id },
      pull: 'scheduledBlast'
    })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation ScheduledBlastDeleteById($id: ID) {
          scheduledBlastDeleteById(id: $id)
        }`,
      variables: { id },
      pull: 'scheduledBlastDeleteById'
    }, { invalidateAll: true })
  }

  upsert = ({ id, contactMethods, filters, emailSubject, emailBody, smsText }) => {
    return this.auth.call({
      query: `
        mutation ScheduledBlastCreate(
          $id: ID
          $contactMethods: [BlastContactMethodEnum]
          $filters: JSON
          $emailSubject: String
          $emailBody: String
          $smsText: String
        ) {
          scheduledBlastUpsert(id: $id, filters: $filters, contactMethods: $contactMethods, emailSubject: $emailSubject, emailBody: $emailBody, smsText: $smsText) { id }
        }`,
      variables: { id, contactMethods, filters, emailSubject, emailBody, smsText },
      pull: 'scheduledBlastUpsert'
    }, { invalidateAll: true })
  }
}
