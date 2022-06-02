import * as _ from 'https://jspm.dev/lodash-es'

import { op, Obs } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import { getCookie, setCookie } from 'https://tfl.dev/@truffle/utils@0.0.1/cookie/cookie.js'
import { getHost } from 'https://tfl.dev/@truffle/utils@0.0.1/request/request-info.js'

import { AUTH_COOKIE } from '../../constants.js'

const GET_ME_GQL = 'query UserGetMe { me { id, name, email, phone, hasPassword, country, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } } }'
const LOGIN_ANON_GQL = 'mutation LoginAnon { userLoginAnon { accessToken } }'
const USER_JOIN_GQL = `mutation UserJoin($name: String, $email: String, $phone: String, $password: String, $inviteTokenStr: String, $referrer: String, $source: String) {
  userJoin(name: $name, email: $email, phone: $phone, password: $password, inviteTokenStr: $inviteTokenStr, referrer: $referrer, source: $source) {
    accessToken
  }
}`
const USER_RESET_PASSWORD_GQL = `mutation UserResetPassword($email: String, $phone: String) {
  userResetPassword(email: $email, phone: $phone)
}`
const USER_LOGIN_GQL = `mutation UserLoginEmailPhone($email: String, $phone: String, $password: String!) {
  userLoginEmailPhone(email: $email, phone: $phone, password: $password) {
    accessToken
  }
}`
const USER_LOGIN_LINK_GQL = `mutation UserLoginLink($userId: ID!, $pushTokenStr: String!) {
  userLoginLink(userId: $userId, pushTokenStr: $pushTokenStr) {
    accessToken
  }
}`

export default class Auth {
  constructor ({ graphqlClient, onQuery }) {
    this.graphqlClient = graphqlClient
    this.onQuery = onQuery

    const accessToken = getCookie(AUTH_COOKIE)
    let initialAccessTokenObs
    if (accessToken) {
      initialAccessTokenObs = this.validateAccessToken(accessToken)
    } else {
      initialAccessTokenObs = Obs.from(this.loginAnon())
    }
    // asyncSubject seems to screw with combineLatest (never completes for some)
    this.isAccessTokenReadyReplaySubject = new Obs.ReplaySubject(0)
    initialAccessTokenObs.pipe(op.take(1)).subscribe(
      (newAccessToken) => {
        if (newAccessToken) {
          this.setAccessToken(newAccessToken)
          this.isAccessTokenReadyReplaySubject.next(true)
          this.isAccessTokenReadyReplaySubject.complete()
          if (!globalThis.window) {
            // so user is in graphqlClient cache for client
            this.getMe({ accessToken: newAccessToken }).pipe(op.take(1)).subscribe()
          }
        }
      }
    )
  }

  getMe = ({ accessToken, fromCache, isErrorable } = {}) => {
    // for ssr we want this to be consistent & cacheable
    const req = {
      query: GET_ME_GQL
    }
    if (fromCache) {
      return this.graphqlClient.getCachedObs('graphql', req).pipe(op.map((res) => { return res?.data?.me }))
    } else if (accessToken) {
      // bypass the For
      return this.graphqlClient.stream('graphql', req, { isErrorable }).pipe(
        op.map((res) => res.data.me)
      )
    } else {
      return this.stream(req, { isErrorable }).pipe(op.map(({ data }) => data.me))
    }
  }

  loginAnon = async () => {
    const { data } = await this.graphqlClient.call('graphql', {
      query: LOGIN_ANON_GQL
    })
    return data?.userLoginAnon.accessToken
  }

  validateAccessToken = (accessToken) => {
    return this.getMe({ fromCache: true }).pipe(
      op.switchMap((me) => {
        return me ? Obs.of(me) : this.getMe({ accessToken, isErrorable: true })
      }),
      op.map((me) => {
        if (!me) {
          console.log('missing', accessToken)
          throw new Error('no user for accesspushToken')
        } else {
          return accessToken
        }
      }),
      op.catchError((err) => {
        console.warn('validate err', err)
        return Obs.from(this.loginAnon())
      })
    )
  }

  setAccessToken = (accessToken) => {
    const host = getHost()
    const domain = host.indexOf('spore.build') !== -1 // FIXME: var?
      ? _.takeRight(host.split('.'), 2).join('.')
      : host // 3rd part domains
    // top level domain
    return setCookie(AUTH_COOKIE, accessToken, { host: domain, allowSubdomains: true })
  }

  logout = async () => {
    this.setAccessToken('')
    const accessToken = await this.loginAnon()
    this.setAccessToken(accessToken)
    this.graphqlClient.invalidateAll()
  }

  join = async (options, { overlay, cookie }) => {
    const {
      name, emailPhone, password, inviteTokenStr, source
    } = options
    const { email, phone } = this.parseEmailPhone(emailPhone)

    const referrer = getCookie('referrer')

    const { data } = await this.graphqlClient.call('graphql', {
      query: USER_JOIN_GQL,
      variables: { name, email, phone, password, inviteTokenStr, referrer, source }
    })
    await this.afterLogin(data.userJoin)
  }

  resetPassword = async ({ emailPhone }) => {
    const { email, phone } = this.parseEmailPhone(emailPhone)

    const { data } = await this.graphqlClient.call('graphql', {
      query: USER_RESET_PASSWORD_GQL,
      variables: { email, phone }
    })
    return data
  }
  // @this.graphqlClient.call 'auth.resetPassword', {email}

  afterLogin = async ({ accessToken }) => {
    this.setAccessToken(accessToken)
    await new Promise((resolve) => setTimeout(() => {
      this.graphqlClient.invalidateAll()
      resolve()
    }, 0)) // this timeout *might* prevent bug where meObs is still logged out user after logging in sometimes (join buttons stay up)
    // let pushToken = this.pushTokenStream.getValue() || 'none'
  }

  login = async ({ emailPhone, password }) => {
    const { email, phone } = this.parseEmailPhone(emailPhone)

    const { data } = await this.graphqlClient.call('graphql', {
      query: USER_LOGIN_GQL,
      variables: { email, phone, password }
    })
    return this.afterLogin(data.userLoginEmailPhone)
  }

  loginLink = async ({ userId, pushTokenStr }) => {
    const { data } = await this.graphqlClient.call('graphql', {
      query: USER_LOGIN_LINK_GQL,
      variables: { userId, pushTokenStr }
    })
    return this.afterLogin(data.userLoginLink)
  }

  stream = (args, options = {}) => {
    const { query, variables, streamOptions, pull, skipAuth, shouldReturnInvalidateFn } = args
    if (!query) {
      console.warn('missing', args)
    }
    options = _.pick(options, [
      'isErrorable', 'isStreamed', 'clientChangesStream', 'ignoreCache',
      'shouldRefetchAfterSsr', 'initialSortFn', 'shouldMergeStreamUpdates',
      'limit', 'shouldPrependNewUpdates', 'ignoreIncrementsFromMe',
      'ignoreNewStream', 'persistThroughInvalidateAll', 'onNewData'
    ])
    if (options.isStreamed && !globalThis.window) {
      // we want to force client to refetch when page is loaded (and not use
      // cache from ssr) so we can subscribe & listen for changes
      options.shouldRefetchAfterSsr = true
      options.isStreamed = false // don't want service to subscribe to pubsub for ssr
    }
    const req = 'graphql'
    const body = { query, variables, streamOptions }
    const getObs = () => {
      // accessToken, userAgent, product added in model/index.js ioEmit
      const stream = this.graphqlClient.stream(req, body, options)
      if (!pull) {
        return stream
      }
      return stream.pipe(
        op.map(({ data, extensions } = {}) => {
          if (!_.isEmpty(extensions?.components)) {
            this.onQuery?.({ data, extensions })
          }
          return pull ? data?.[pull] : data
        }),
        op.publishReplay(1),
        op.refCount()
      )
    }
    let obs
    if (skipAuth) {
      obs = getObs()
    } else {
      obs = Obs.combineLatest(
        this.isAccessTokenReadyReplaySubject,
        this.siteInfoReadyObs
      ).pipe(op.switchMap(getObs))
    }
    if (shouldReturnInvalidateFn) {
      return {
        invalidateFn: () => this.graphqlClient.invalidate(req, body),
        obs
      }
    } else {
      return obs
    }
  }

  call = async (args, options = {}) => {
    const { query, variables, streamOptions, pull } = args
    if (!query) {
      console.warn('missing', args)
    }
    const { invalidateAll, invalidateSingle, additionalDataObs } = options

    // accessToken, userAgent, product added in model/index.js ioEmit
    await this.isAccessTokenReadyReplaySubject.pipe(op.take(1)).toPromise()
    await this.siteInfoReadyObs.pipe(op.take(1)).toPromise()
    const response = await this.graphqlClient.call('graphql', { query, variables, streamOptions }, {
      additionalDataObs
    })
    if (invalidateAll) {
      console.log('Invalidating all')
      this.graphqlClient.invalidateAll()
      // give time for invalidate to finish before being 'done'.
      // otherwise if a stream req is made immediately after the call is done
      // it sometimes breaks (stream simulataneous with invalidation)
      // eg saving scheduledBlast, routes back to scheduledBlasts page which
      // streams immediately
      await new Promise((resolve) => setTimeout(resolve, 0))
    } else if (invalidateSingle) {
      this.graphqlClient.invalidate('graphql', invalidateSingle)
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
    if (pull) {
      return response.data[pull]
    } else {
      return response
    }
  }

  setSiteInfoReadyObs = (siteInfoReadyObs) => {
    this.siteInfoReadyObs = siteInfoReadyObs
  }

  parseEmailPhone = (emailPhone) => {
    const isPhone = emailPhone?.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/)
    if (isPhone) {
      return { phone: emailPhone }
    } else {
      return { email: emailPhone }
    }
  }
}
