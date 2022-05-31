const GRAPHQL_FIELDS = `
  amountValue
  date
  amount
  economyAction {
    name
  }
`

export default class EconomyTransaction {
  constructor ({ auth }) {
    this.auth = auth
  }

  create = ({ economyActionId, additionalData, userId, amountSourceId, amountValue, economyTriggerSlug }) => {
    return this.auth.call({
      query: `
        mutation EconomyTransactionCreate($economyActionId: ID, $additionalData: JSON, $userId: ID, $amountSourceId: String, $amountValue: Float, $economyTriggerSlug: String) {
          economyTransactionCreate(economyActionId: $economyActionId, userId: $userId, economyTriggerSlug: $economyTriggerSlug, additionalData: $additionalData, amountSourceId: $amountSourceId, amountValue: $amountValue) { id }
        }`,
      variables: { economyActionId, additionalData, userId, amountValue, amountSourceId, economyTriggerSlug },
      pull: 'economyTransactionCreate'
    }, { invalidateAll: true })
  }

  getAll = ({ limit, onNewData, isStreamed } = {}) => {
    const options = {
      isStreamed,
      shouldPrependNewUpdates: true,
      onNewData
    }
    return this.auth.stream({
      query: `
        query EconomyTransactionConnection($limit: Int) {
          economyTransactionConnection(limit: $limit) {
            nodes { ${GRAPHQL_FIELDS} }
          }
        }`,
      streamOptions: {
        streamGraphQL: `{ ${GRAPHQL_FIELDS} }`
      },
      variables: { limit },
      pull: 'economyTransactionConnection'
    }, options)
  }

  getAllByAmount = ({ amountType, amountId, limit, onNewData, isStreamed } = {}) => {
    const options = {
      isStreamed,
      shouldPrependNewUpdates: true,
      onNewData
    }
    return this.auth.stream({
      query: `
        query EconomyTransactionConnection($amountType: String, $amountId: String, $limit: Int) {
          economyTransactionConnection(amountType: $amountType, amountId: $amountId, limit: $limit) {
            nodes { ${GRAPHQL_FIELDS} }
          }
        }`,
      streamOptions: {
        streamGraphQL: `{ ${GRAPHQL_FIELDS} }`
      },
      variables: { amountType, amountId, limit },
      pull: 'economyTransactionConnection'
    }, options)
  }
}
