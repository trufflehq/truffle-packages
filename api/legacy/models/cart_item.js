export default class CartItem {
  constructor ({ auth }) {
    this.auth = auth
  }

  upsert = async ({ id, cartId, sourceType, sourceId, quantity }) => {
    return this.auth.call({
      query: `
        mutation CartItemUpsert(
          $id: ID,
          $cartId: ID,
          $sourceType: String,
          $sourceId: ID,
          $quantity: Int
        ) {
          cartItemUpsert(
            id: $id,
            cartId: $cartId,
            sourceType: $sourceType,
            sourceId: $sourceId,
            quantity: $quantity
          ) {
            id
          }
        }
        `,
      variables: { id, cartId, sourceType, sourceId, quantity },
      pull: 'cartItemUpsert'
    }, { invalidateAll: true })
  }

  batchUpsert = async ({ cartItems }) => {
    return this.auth.call({
      query: `
        mutation CartItemsBatchUpsert(
          $cartItems: JSON
        ) {
          cartItemBatchUpsert(
            cartItems: $cartItems
          )
        }
      `,
      variables: { cartItems },
      pull: 'cartItemBatchUpsert'
    }, { invalidateAll: true })
  }

  deleteById = async (id) => {
    return this.auth.call({
      query: `
        mutation CartItemDeleteById(
          $id: ID
        ) {
          cartItemDeleteById(id: $id)
        }
        `,
      variables: { id },
      pull: 'cartItemDeleteById'
    }, { invalidateAll: true })
  }

  deleteAllByCartId = async (cartId) => {
    return this.auth.call({
      query: `
        mutation CartItemDeleteAllByCartId(
          $cartId: ID
        ) {
          cartItemDeleteAllByCartId(cartId: $cartId)
        }
        `,
      variables: { cartId },
      pull: 'cartItemDeleteAllByCartId'
    }, { invalidateAll: true })
  }
}
