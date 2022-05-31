export default class PushSubscription {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query PushSubscriptionGetAll {
          pushSubscriptions {
            nodes {
              id, filters, isEnabled
            }
          }
        }`,
      // variables: {},
      pull: 'pushSubscriptions'
    })
  }

  batchUpsert = (pushSubscriptions) => {
    return this.auth.call({
      query: `
        mutation PushSubscriptionBatchUpsert(
          $pushSubscriptions: JSON
        ) {
          pushSubscriptionBatchUpsert(pushSubscriptions: $pushSubscriptions)
        }
      `,
      variables: { pushSubscriptions },
      pull: 'pushSubscription'
    }, { invalidateAll: true })
  }
}
