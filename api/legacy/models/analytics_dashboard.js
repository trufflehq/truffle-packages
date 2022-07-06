import { FRAGMENT_CHART_WITH_DATAPOINTS } from '../constants.js'

export default class AnalyticsDashboard {
  constructor ({ auth }) {
    this.auth = auth
  }

  getWithCharts = (options) => {
    const {
      id, filterId, filterValue, startDate, endDate, timeScale
    } = options
    return this.auth.stream({
      query: `
        query AnalyticsDashboardBySlugWithCharts(
          $id: ID
          $filterId: ID
          $filterValue: String
          $startDate: String
          $endDate: String
          $timeScale: String
        ) {
          analyticsDashboard(id: $id) {
            id, slug, name
            charts {
              nodes {
                ...chartWithDatapoints
              }
            }
          }
        }  ${FRAGMENT_CHART_WITH_DATAPOINTS}`,
      variables: {
        id, filterId, filterValue, startDate, endDate, timeScale
      },
      pull: 'analyticsDashboard'
    })
  }

  getAll = () => {
    console.warn('get dashboards', Date.now())
    return this.auth.stream({
      query: `
        query AnalyticsDashboards {
          analyticsDashboard {
            nodes { slug, name }
          }
        }`,
      // variables: {},
      pull: 'analyticsDashboard'
    })
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query AnalyticsDashboardById(
          $id: ID!
        ) {
          analyticsDashboard(id: $id) {
            id, name, slug
          }
        }`,
      variables: { id },
      pull: 'analyticsDashboard'
    })
  }

  getBySlug = (slug) => {
    return this.auth.stream({
      query: `
        query AnalyticsDashboardBySlug(
          $slug: String!
        ) {
          analyticsDashboard(slug: $slug) {
            id, name, slug
          }
        }`,
      variables: { slug },
      pull: 'analyticsDashboard'
    })
  }

  upsert = ({ id, name }) => {
    return this.auth.call({
      query: `
        mutation AnalyticsDashboardUpsert(
          $id: ID
          $name: String!
        ) {
          analyticsDashboardUpsert(id: $id, name: $name) {
            name
          }
        }
`,
      variables: { id, name },
      pull: 'analyticsDashboardUpsert'
    }, { invalidateAll: true })
  }

  deleteById = (id) => {
    return this.auth.call({
      query: `
        mutation AnalyticsDashboardDeleteById($id: ID) {
          analyticsDashboardDeleteById(id: $id)
        }
`,
      variables: { id },
      pull: 'analyticsDashboardDeleteById'
    }, { invalidateAll: true })
  }
}
