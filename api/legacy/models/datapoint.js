export default class Datapoint {
  constructor ({ auth }) {
    this.auth = auth
  }

  incrementMetric = (metricSlug, count = 1, options = {}) => {
    const {
      date,
      dimensionValues = {},
      filterValues = {},
      timeScale = 'day',
      isTotal,
      isSingleTimeScale
    } = options

    return this.auth.call({
      query: `
        mutation DatapointIncrementMetric(
          $metricSlug: String!
          $dimensionValues: JSONObject
          $count: Int!
          $date: Date
          $filterValues: JSONObject
          $timeScale: String
          $isTotal: Boolean
          $isSingleTimeScale: Boolean
        ) {
          datapointIncrementMetric(
            metricSlug: $metricSlug
            dimensionValues: $dimensionValues
            count: $count
            date: $date
            filterValues: $filterValues
            timeScale: $timeScale
            isTotal: $isTotal
            isSingleTimeScale: $isSingleTimeScale
          )
        }`,
      variables: { metricSlug, dimensionValues, count, date, filterValues, timeScale, isTotal, isSingleTimeScale },
      pull: 'datapointIncrement'
    }, { invalidateAll: false })
  }

  incrementUnique = (metricSlug, sourceType, sourceId, { date, filterValues } = {}) => {
    return this.auth.call({
      query: `
        mutation DatapointIncrementUnique(
          $metricSlug: String!
          $filterValues: JSONObject
          $sourceType: String!
          $sourceId: String!
          $date: Date
        ) {
          datapointIncrementUnique(
            metricSlug: $metricSlug
            filterValues: $filterValues
            sourceType: $sourceType
            sourceId: $sourceId
            date: $date
          )
        }`,
      variables: { metricSlug, filterValues, sourceType, sourceId, date },
      pull: 'datapointIncrementUnique'
    }, { invalidateAll: false })
  }
}
