// TODO: should this just be 'truffle-ssr'? so react can ignore dep?
import { getSsrReq } from 'https://tfl.dev/@truffle/utils@0.0.1/ssr/ssr.js'

export function getHost () {
  if (typeof document !== 'undefined') {
    return window.location.host
  } else {
    return getSsrReq?.()?.headers?.host || ''
  }
}

export function getUserAgent () {
  if (typeof document !== 'undefined') {
    return navigator.userAgent
  } else {
    return getSsrReq?.()?.headers?.['user-agent'] || ''
  }
}
