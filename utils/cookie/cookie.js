import cookieLib from 'https://npm.tfl.dev/cookie'
import globalContext from 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'

import isSsr from '../ssr/is-ssr.ts'

const COOKIE_DURATION_MS = 365 * 24 * 3600 * 1000 // 1 year

class Cookie {
  constructor () {
    this.cookies = this.getInitialCookies()
    this.cookiesToSet = []
  }

  getInitialCookies () {
    if (isSsr) {
      const context = globalContext.getStore()
      return cookieLib.parse(context.ssr.req.headers.cookie)
    } else {
      return cookieLib.parse(document.cookie || '') || {}
    }
  }

  setCookie = (key, value, options) => {
    this.cookies[key] = value
    this.cookiesToSet.push({ key, value, options })
    if (isSsr) {
      try {
        const context = globalContext.getStore()
        // set all cookies in a single header
        context.ssr.res?.setHeader('Set-Cookie', this.cookiesToSet.map(({ key, value, options }) =>
          cookieLib.serialize(key, value, options)
        ))
      } catch (err) {
        console.log('error setting cookie ssr', err)
      }
    } else {
      document.cookie = cookieLib.serialize(key, value, options)
    }
  }

  getCookieOpts = (key, { ttlMs = COOKIE_DURATION_MS, host, allowSubdomains }) => {
    const context = globalContext.getStore()
    host = host || context.config.host
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

export const setCookie = (key, value, options) => {
  const context = globalContext.getStore()
  const cookie = context._cookie || new Cookie()
  return cookie.set(key, value, options)
}
export const getCookie = (key) => {
  const context = globalContext.getStore()
  const cookie = context._cookie || new Cookie()
  return cookie.get(key)
}
