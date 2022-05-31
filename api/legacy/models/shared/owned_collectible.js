export default class OwnedCollectible {
  constructor ({ auth }) {
    this.auth = auth
  }

  getAllByCollectibleType = (collectibleType) => {
    return this.auth.stream({
      query: `
        query OwnedCollectibleGetAll($collectibleType: String) {
          ownedCollectibles(collectibleType: $collectibleType) {
            nodes {
              collectible {
                name
              }
            }
          }
        }`,
      variables: { collectibleType },
      pull: 'ownedCollectibles'
    })
  }

  redeemByCollectibleId = (collectibleId, { additionalData } = {}) => {
    return this.auth.call({
      query: `
        mutation OwnedCollectibleRedeem($collectibleId: ID, $additionalData: JSON) {
          ownedCollectibleRedeem(collectibleId: $collectibleId, additionalData: $additionalData) { redeemResponse, redeemError }
        }`,
      variables: { collectibleId, additionalData },
      pull: 'ownedCollectibleRedeem'
    }, { invalidateAll: true })
  }

  increment = ({ collectibleId, userId, count }) => {
    return this.auth.call({
      query: `
        mutation OwnedCollectibleIncrement($collectibleId: ID, $userId: ID, $count: Int) {
          ownedCollectibleIncrement(collectibleId: $collectibleId, userId: $userId, count: $count)
        }`,
      variables: { collectibleId, userId, count },
      pull: 'ownedCollectibleIncrement'
    }, { invalidateAll: true })
  }
}
