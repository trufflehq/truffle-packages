// TODO: should this just be 'truffle-ssr'? so react can ignore dep?
import { getSsrReq, getSsrRes } from 'https://tfl.dev/@truffle/utils@0.0.1/ssr/ssr.js'
import cookieLib from 'https://jspm.dev/cookie'

import { getHost } from '../request/request-info.js'

const COOKIE_DURATION_MS = 365 * 24 * 3600 * 1000 // 1 year

class Cookie {
  constructor () {
    this.cookies = this.getInitialCookies()
    this.cookiesToSet = []
  }

  getInitialCookies () {
    if (typeof window !== 'undefined') {
      return cookieLib.parse(document.cookie) || {}
    } else {
      return getSsrReq()?.cookies || {}
    }
  }

  setCookie = (key, value, options) => {
    this.cookies[key] = value
    this.cookiesToSet.push({ key, value, options })
    if (typeof window !== 'undefined') {
      document.cookie = cookieLib.serialize(key, value, options)
    } else {
      try {
        // set all cookies in a single header
        getSsrRes()?.setHeader('Set-Cookie', this.cookiesToSet.map(({ key, value, options }) =>
          cookieLib.serialize(key, value, options)
        ))
      } catch (err) {
        console.log('error setting cookie ssr', err)
      }
    }
  }

  getCookieOpts = (key, { ttlMs = COOKIE_DURATION_MS, host, allowSubdomains }) => {
    host = host || getHost()
    const hostname = host.split(':')[0] // ignore port

    const isIp = hostname.match(/^[0-9]{1,3}(\.[0-9]{1,3}){3}$/)
    const isDev = hostname === 'localhost' || isIp

    return {
      path: '/',
      expires: new Date(Date.now() + ttlMs),
      // sameSite needs to be 'none' for cookies to work if page is iframed
      // but can't be none when served over https
      // TODO: we should have sameSite: 'none' if dev but ssl is enabled
      sameSite: isDev ? undefined : 'none',
      secure: !isDev,
      // SameSite: 'None',
      // if allowSubdomains is true (and no on dev), set cookie on subdomains (period in front).
      // specifying just hostname for some reason is still having a period in front,
      // so we leave domain as undefined to only set for "hostname" (no period)
      // NOTE: if we ever want do do .customdomain.com for creators (so www shares same cookies),
      // make sure we *don't* do the same for spore.build
      domain: (isDev || !allowSubdomains) ? undefined : '.' + hostname
    }
  }

  // allowSubdomains adds period in front of host
  // so we want users to be logged in across all sites, but we don't want
  // .spore.build cookies for stuff like orgSlug
  // https://github.com/jshttp/cookie/issues/18
  set = (key, value, { ttlMs = COOKIE_DURATION_MS, host, allowSubdomains } = {}) => {
    this.cookies[key] = value
    const options = this.getCookieOpts(key, { ttlMs, host, allowSubdomains })
    return this.setCookie(key, value, options)
  }

  get = (key) => {
    return this.cookies[key]
  }
}

const cookie = new Cookie()

// TODO: use asyncLocalStorage to get cookie instance for ssr
export const setCookie = (key, value, options) => {
  return cookie.set(key, value, options)
}
export const getCookie = (key) => {
  return cookie.get(key)
}
