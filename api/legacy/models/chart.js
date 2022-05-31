import { FRAGMENT_CHART_WITH_DATAPOINTS } from '../constants.js'

export default class Chart {
  constructor ({ auth }) {
    this.auth = auth
  }

  getById = (id, options) => {
    const {
      filterId, filterValue, startDate, endDate, timeScale
    } = options
    return this.auth.stream({
      query: `
        query ChartGetById(
          $id: ID
          $filterId: ID
          $filterValue: String
          $startDate: String
          $endDate: String
          $timeScale: String
        ) {
          chart(id: $id) {
            ...chartWithDatapoints
          }
        }  ${FRAGMENT_CHART_WITH_DATAPOINTS}`,
      variables: {
        id, filterId, filterValue, startDate, endDate, timeScale
      },
      pull: 'chart'
    })
  }
}
