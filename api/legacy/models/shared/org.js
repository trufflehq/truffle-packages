import { getCookie, setCookie } from 'https://tfl.dev/@truffle/utils@0.0.1/cookie/cookie.js'

import { FRAGMENT_ORG_WITH_CONFIG } from '../../constants.js'

// query name important for caching
const GET_ME_QUERY = `
  query CacheableOrgWithConfig {
    org {
      ...orgWithConfig
    }
  } ${FRAGMENT_ORG_WITH_CONFIG}`

export default class Org {
  constructor ({ auth, proxy, apiUrl, graphqlClient }) {
    this.auth = auth
    this.proxy = proxy
    this.apiUrl = apiUrl
    this.graphqlClient = graphqlClient
  }

  getChatName (org, lang) {
    // FIXME: non-hardcoded
    return org?.name
      ? lang.get('org.longName', { replacements: { orgName: org?.name } })
      : 'Loading'
  }

  hasFeature (org, feature) {
    return org?.orgConfig?.features &&
      org?.orgConfig?.features?.indexOf(feature) !== -1
  }

  getUrl (org, { config, router }) {
    if (config.ENV === config.ENVS.DEV) {
      // subdomains don't work well with localhost/ip
      return `http://${config.SPORE_HOST || config.HOST}/org/${org?.slug}`
    }
    if (!org) {
      return '/'
    }

    return org.domain
      ? `https://${org.domain}`
      : `https://${org.slug}.${config.SPORE_HOST || config.HOST}`
  }

  // uses orgSlug automatically
  getMe = () => {
    return this.auth.stream({
      query: GET_ME_QUERY,
      // variables: {},
      pull: 'org'
    }, { persistThroughInvalidateAll: true })
  }

  invalidateGetMeThenAll = () => {
    this.graphqlClient.invalidate('graphql', { query: GET_ME_QUERY })
    this.graphqlClient.invalidateAll()
  }

  getById = (id) => {
    return this.auth.stream({
      query: `
        query OrgById($id: ID!) {
          org(id: $id) {
            slug
            name
            domain
            timezone
            orgConfig {
              socials
              colors
              cssVars
              flags
            }
          }
        }`,
      variables: { id },
      pull: 'org'
    })
  }

  getByDomain = (domain) => {
    // skip auth
    return this.auth.stream({
      query: `
        query OrgByDomain($domain: String) {
          org(domain: $domain) {
            slug
          }
        }`,
      variables: { domain },
      pull: 'org',
      skipAuth: true
    })
  }

  getAll = () => {
    return this.auth.stream({
      query: `
        query OrgGetAll {
          orgs {
            nodes {
              id
              name
            }
          }
        }`,
      // variables: {},
      pull: 'orgs'
    })
  }

  create = async ({ name } = {}, { cookie }) => {
    const res = await this.auth.call({
      query: `
        mutation OrgCreate(
          $name: String
        ) {
          orgCreate(name: $name) {
            id, slug
          }
        }`,
      variables: { name },
      pull: 'orgCreate'
    }, { invalidateAll: false })

    setCookie('orgSlug', res.slug)
    this.invalidateGetMeThenAll()

    return res
  }

  completeSetup = async () => {
    return this.auth.call({
      query: `
        mutation OrgCompleteSetup {
          orgCompleteSetup {
            id, slug
          }
        }`,
      // variables: {},
      pull: 'orgCreate'
    }, { invalidateSingle: { query: GET_ME_QUERY } })
  }

  upsert = async (diff, { file } = {}) => {
    const { name, slug } = diff
    const query = `
      mutation OrgUpsert(
        $name: String
        $slug: String
      ) {
        orgUpsert(
          name: $name
          slug: $slug
        ) { id }
      }`
    const variables = {
      name, slug
    }
    if (file) {
      const formData = new FormData()
      formData.append('file', file, file.name)

      console.log('up', this.apiUrl + '/upload')
      const response = await this.proxy(this.apiUrl + '/upload', {
        method: 'POST',
        query: {
          graphqlQuery: query,
          variables: JSON.stringify(variables)
        },
        body: formData
      })
      // this (graphqlClient.update) doesn't actually work... it'd be nice
      // but it doesn't update existing streams
      // .then @graphqlClient.update
      setTimeout(() => {
        this.graphqlClient.invalidate('graphql', { query: GET_ME_QUERY })
      }, 0)
      return response
    } else {
      return this.auth.call({ query, variables }, { invalidateSingle: { query: GET_ME_QUERY } })
    }
  }

  join = async ({ me, overlay, cookie, source }) => {
    const referrer = getCookie('referrer')

    await this.auth.call({
      query: `
        mutation OrgJoin($referrer: String, $source: String) {
          orgJoin(referrer: $referrer, source: $source)
        }`,
      variables: { referrer, source }
    }, { invalidateAll: true })
  }

  // HACK/hardcode for mg orgs
  isMg = (org) =>
    [
      'purpled', 'lunar', 'boomerna', 'sadist', 'gamers-react',
      'bea-plays', 'f1nn', 'foolish'
    ].includes(org?.slug)
}
