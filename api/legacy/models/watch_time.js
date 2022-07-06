
export default class WatchTime {
  constructor ({ auth }) {
    this.auth = auth
  }

  increment = (secondsWatched, sourceType) => {
    return this.auth.call({
      query: `
        mutation IncrementWatchTime($secondsWatched: Int!, $sourceType: String!) {
          watchTimeIncrement(secondsWatched: $secondsWatched, sourceType: $sourceType)
        }
        `,
      variables: {
        secondsWatched,
        sourceType
      },
      pull: 'watchTimeIncrement'
    }, { invalidateAll: true })
  }

  // TODO - migrate to economyTransaction.create when we have ea cooldowns
  claim = (sourceType) => {
    return this.auth.call({
      query: `
        mutation WatchTimeClaim($sourceType: String!) {
          watchTimeClaim(sourceType: $sourceType) {
            amountId
            amountValue
          }
        }`,
      variables: {
        sourceType
      },
      pull: 'watchTimeClaim'
    }, { invalidateAll: true })
  }
}
