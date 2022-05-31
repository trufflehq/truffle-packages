import { defaultEconomyTriggerIds } from '../constants.js'

const DEFAULT_FIELDS = `
  id
  orgId
  name
  economyTriggerId
  amountValue
  amountType
  amountId
  isVariableAmount
  data {
    description
    cooldownSeconds
    amountDescription
  }`

export default class EconomyAction {
  constructor ({ auth }) {
    this.auth = auth
  }

  getByEconomyTriggerId = (economyTriggerId) => {
    return this.auth.stream({
      query: `
        query EconomyActionByTriggerId($economyTriggerId: ID) {
          economyAction(economyTriggerId: $economyTriggerId) {
            id
            orgId
            name
            action
            sourceType
            amountValue
            amountId
            data {
              items {
                source {
                  id
                  name
                  type
                  fileRel {
                    key
                    fileId
                    fileObj {
                      id
                      cdn
                      data
                      prefix
                      contentType
                      type
                      variations
                      ext
                    }
                  }
                  data {
                    redeemType
                    description
                    category
                    redeemData
                  }
                }
                sourceType
                sourceId
                amount
                color
              }
              cooldownSeconds
            }
          }
        }`,
      variables: {
        economyTriggerId
      },
      pull: 'economyAction'
    })
  }

  getByAmountType = (amountType) => {
    return this.auth.stream({
      query: `query EconomyActionByAmountType($amountType: String) {
        economyActions(amountType: $amountType) {
          nodes { ${DEFAULT_FIELDS} }
        }
      }`,
      variables: {
        amountType
      },
      pull: 'economyActions'
    })
  }

  getAll = () => {
    return this.auth.stream({
      query: `query EconomyActionGetAll {
        economyActions {
          nodes { ${DEFAULT_FIELDS} }
        }
      }`,
      pull: 'economyActions'
    })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query EconomyActionById($id: ID) {
          economyAction(id: $id) {
            ${DEFAULT_FIELDS} dataRaw
          }
        }`,
      variables: { id },
      pull: 'economyAction'
    })
  }

  upsert = ({ id, name, economyTriggerId, amountValue, amountType, amountId, isVariableAmount, data }) => {
    return this.auth.call({
      query: `
        mutation EconomyActionUpsert(
          $id: ID
          $name: String
          $economyTriggerId: ID
          $amountType: String
          $amountId: String
          $amountValue: Float
          $data: JSON
        ) {
          economyActionUpsert(id: $id, name: $name, economyTriggerId: $economyTriggerId, amountType: $amountType, amountId: $amountId, amountValue: $amountValue, data: $data) { id }
        }`,
      variables: { id, name, economyTriggerId, amountValue, amountType, amountId, isVariableAmount, data },
      pull: 'economyActionUpsert'
    }, { invalidateAll: true })
  }

  getDefaultActions = () => defaultEconomyTriggerIds
}
