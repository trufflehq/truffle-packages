// FIXME: get rid of lodash in all files
import _ from 'https://npm.tfl.dev/lodash?no-check'
import { createSubject, op, Obs } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import request from 'https://tfl.dev/@truffle/utils@0.0.1/legacy/request.js'
import { getUserAgent } from 'https://tfl.dev/@truffle/utils@0.0.1/request/request-info.js'
import { getCookie } from 'https://tfl.dev/@truffle/utils@0.0.1/cookie/cookie.js'

import Auth from './models/shared/auth.js'
import Connection from './models/shared/connection.js'
import Collectible from './models/shared/collectible.js'
import Drawer from './models/shared/drawer.js'
import File from './models/shared/file.js'
import Image from './models/shared/image.js'
import KeyValue from './models/shared/key_value.js'
import LoginLink from './models/shared/login_link.js'
import Org from './models/shared/org.js'
import OrgConfig from './models/shared/org_config.js'
import OrgPrivateData from './models/shared/org_private_data.js'
import OrgUser from './models/shared/org_user.js'
import OrgUserInvite from './models/shared/org_user_invite.js'
import OwnedCollectible from './models/shared/owned_collectible.js'
import Role from './models/shared/role.js'
import Permission from './models/shared/permission.js'
import PushToken from './models/shared/push_token.js'
import StatusBar from './models/shared/status_bar.js'
import Time from './models/shared/time.js'
import User from './models/shared/user.js'

import { API_URL, CDN_URLS } from './constants.js'
import io from './io.js'
import GraphqlClient from './graphql-client.js'

const SERIALIZATION_KEY = 'MODEL'
const MAX_ACCEPTABLE_GRAPHQL_CLIENT_TIME_DIFF_MS = 1000 * 30 // 30 seconds

/*
  // FIXME: replacements for
    const {
      cdnUrls, ip
    } = options
*/

export default class Model {
  constructor () {
    console.log('new model')
    const cache = globalThis?.window?.[SERIALIZATION_KEY] || {}
    if (typeof document !== 'undefined') {
      window[SERIALIZATION_KEY] = null
      // maybe this means less memory used for long caches
      const $$el = document.querySelector('.model')
      $$el && ($$el.innerHTML = '')
    }

    this.isFromCache = Object.keys(cache).length > 0

    const ioEmit = (event, opts) => {
      const accessToken = getCookie('accessToken')
      let siteInfo
      try {
        siteInfo = JSON.parse(getCookie('siteInfo') || '{}')
      } catch (err) {
        console.log('error parsing cookie', err)
      }
      const sporeAdminSecret = getCookie('sporeAdmin')
      console.log('emit', siteInfo, getCookie('siteInfo'))
      return io.emit(
        event,
        _.defaults({ accessToken, orgId: siteInfo?.orgId, userAgent: getUserAgent(), sporeAdminSecret, ip: this.ip }, opts)
      )
    }

    this.proxy = async (url, { method, body, beforeSend, query = {} }) => {
      const accessToken = getCookie('accessToken')
      let siteInfo
      try {
        siteInfo = JSON.parse(getCookie('siteInfo') || '{}')
      } catch {}

      if (accessToken) {
        query.accessToken = accessToken
      }
      if (siteInfo?.orgId) {
        query.orgId = siteInfo?.orgId
      }

      return request(url, { method, query, body, beforeSend })
    }

    let offlineCache
    if (globalThis?.navigator?.onLine) {
      offlineCache = null
    } else {
      offlineCache = (() => {
        try {
          return JSON.parse(window.localStorage?.offlineCache)
        } catch (error) {
          return {}
        }
      })()
    }

    // console.log('offline', offlineCache)
    this.initialCache = _.defaults(offlineCache, cache.graphqlClient)
    this.initialCacheTime = cache.now
    // console.log('init', this.initialCache)

    console.log('set graphql client')
    this.graphqlClient = new GraphqlClient({
      ioEmit,
      cache: this.initialCache
    })

    const tokenStream = createSubject(null)

    this.localCache = {}
    // NOTE: onQuery technically gets called more than once per query,
    // since it's inside of the stream map (i'm not sure of the exact
    // logistics of that, but the map fn gets called more frequently)
    // TODO: we should try to reduce # of times this is called (~15), since
    // the merge may not be that cheap
    const onQuery = ({ extensions }) => {
      if (extensions?.components) {
        _.merge(this.localCache, {
          components: extensions.components
        })
      }
    }

    this.auth = new Auth({
      graphqlClient: this.graphqlClient,
      tokenStream,
      onQuery
    })

    this.collectible = new Collectible({ auth: this.auth, proxy: this.proxy, apiUrl: API_URL, graphqlClient: this.graphqlClient })
    this.image = new Image({ additionalScript: this.additionalScript, cdnUrls: CDN_URLS })
    this.file = new File({ auth: this.auth, apiUrl: API_URL, proxy: this.proxy, graphqlClient: this.graphqlClient })
    this.connection = new Connection({ auth: this.auth })
    this.keyValue = new KeyValue({ auth: this.auth })
    this.org = new Org({ auth: this.auth, proxy: this.proxy, graphqlClient: this.graphqlClient, apiUrl: API_URL })
    this.orgConfig = new OrgConfig({ auth: this.auth, org: this.org })
    this.orgPrivateData = new OrgPrivateData({ auth: this.auth })
    this.orgUser = new OrgUser({ auth: this.auth })
    this.orgUserInvite = new OrgUserInvite({ auth: this.auth })
    this.ownedCollectible = new OwnedCollectible({ auth: this.auth })
    this.loginLink = new LoginLink({ auth: this.auth })
    this.role = new Role({ auth: this.auth })
    this.permission = new Permission({ auth: this.auth })
    this.pushToken = new PushToken({ auth: this.auth, tokenStream })
    this.statusBar = new StatusBar()
    this.time = new Time({ auth: this.auth })
    this.user = new User({
      auth: this.auth,
      proxy: this.proxy,
      graphqlClient: this.graphqlClient,
      apiUrl: API_URL
    })

    this.drawer = new Drawer()
  }

  // after page has loaded, refetch all initial (cached) requestsObs to verify they're still up-to-date
  validateInitialCache = () => {
    const cache = this.initialCache
    const timeDiffMs = Math.abs(Date.now() - this.initialCacheTime)
    // allow for clock skew
    if (timeDiffMs < MAX_ACCEPTABLE_GRAPHQL_CLIENT_TIME_DIFF_MS) {
      console.log('graphqlClient cache up-to-date')
      return
    }

    this.initialCache = null

    console.log('refetching from graphqlClient for latest version')

    // could listen for postMessage from service worker to see if this is from
    // cache, then validate data
    const requestsObsArr = _.map(cache, (result, key) => {
      let req
      try {
        req = JSON.parse(key)
      } catch (error) {
        req = {}
      }

      if (req.path) {
        return this.auth.stream(req.body, { ignoreCache: true })
      }
    }) //, options

    // TODO: seems to use anon cookie for this. not sure how to fix...
    // i guess keep initial cookie stored and run using that?

    // so need to handle the case where the cookie changes between server-side
    // cache and the actual get (when user doesn't exist from graphqlClient, but cookie gets user)

    return Obs.combineLatest(
      requestsObsArr
    )
      .pipe(op.take(1)).subscribe(responses => {
        responses = _.zipWith(responses, _.keys(cache), (response, req) => ({
          req,
          response
        }))
        const cacheArray = _.map(cache, (response, req) => ({
          req,
          response
        }))
        // see if our updated responses differ from the cached data.
        const changedReqs = _.differenceWith(responses, cacheArray, _.isEqual)
        // update with new values
        _.map(changedReqs, ({ req, response }) => {
          console.log('OUTDATED graphqlClient:', req, 'replacing...', response)
          return this.graphqlClient.setDataCache(req, response)
        })

        // TODO: with service worker offline caching, we'd want to delete html cache if changedReqs isn't empty
        // if there's a change this will be invalidated every time
        // eg. if we add some sort of timer / visitCount to user.getMe
        // i'm not sure if that's a bad thing or not. some people always
        // load from cache then update, and this would basically be the same
      })
  }
  // FIXME TODO invalidate in service worker

  setup = ({ ip }) => {
    this.ip = ip
  }

  wasCached = () => { return this.isFromCache }

  dispose = () => {
    this.time.dispose()
    return this.graphqlClient.disposeAll()
  }

  getSerializationObs = () => {
    return this.graphqlClient.getCacheObs()
      .pipe(op.map(function (graphqlClientCache) {
        const string = JSON.stringify({
          graphqlClient: graphqlClientCache,
          now: Date.now()
        }).replace(/<\/script/gi, '<\\/script')
        return `window['${SERIALIZATION_KEY}']=${string};`
      })
      )
  }

  // synchronous version for crappy react ssr
  getSerialization () {
    const graphqlClientCache = this.graphqlClient.getSynchronousCache()
    const string = JSON.stringify({
      graphqlClient: graphqlClientCache,
      now: Date.now()
    }).replace(/<\/script/gi, '<\\/script')
    return `window['${SERIALIZATION_KEY}']=${string};`
  }
}
