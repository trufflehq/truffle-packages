// TODO: probably shouldn't need this anymore
let _appKey, _mainHost

export function setAppKey (appKey) { _appKey = appKey }
export function setMainHost (mainHost) { _mainHost = mainHost }

export function isMobile ({ userAgent } = {}) {
  userAgent = userAgent || globalThis?.navigator?.userAgent
  return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(userAgent)
  // return !window.matchMedia('(min-width: 768px)').matches // breakPointMedium
}

export function isAndroid ({ userAgent } = {}) {
  userAgent = userAgent || globalThis?.navigator?.userAgent
  return userAgent?.includes('Android')
}

export function isIos ({ userAgent } = {}) {
  userAgent = userAgent || globalThis?.navigator?.userAgent
  return Boolean(userAgent?.match(/iP(hone|od|ad)/g))
}

export function iosVersion ({ userAgent } = {}) {
  userAgent = userAgent || globalThis?.navigator?.userAgent
  return parseInt(userAgent?.match(/OS [\d_]+/i)?.[0]?.substr(3).split('_')?.[0])
}

export function isNativeApp ({ userAgent } = {}) {
  userAgent = userAgent || globalThis?.navigator?.userAgent
  return userAgent?.toLowerCase().includes(` ${_appKey}/`)
}

export function isMainApp ({ userAgent } = {}) {
  userAgent = userAgent || globalThis?.navigator?.userAgent
  return userAgent?.toLowerCase().includes(` ${_appKey}/${_appKey}`)
}

export function isMainHost ({ host } = {}) {
  host = host || globalThis?.window?.location.host.replace('www.', '')
  return host === _mainHost
}

export function isOrganizationApp (organizationAppKey, { userAgent } = {}) {
  userAgent = userAgent || globalThis?.navigator?.userAgent
  return Boolean(organizationAppKey &&
    userAgent?.toLowerCase().includes(` ${_appKey}/${organizationAppKey}/`)
  )
}

export function getAppKey ({ userAgent } = {}) {
  userAgent = userAgent || globalThis?.navigator?.userAgent
  const matches = userAgent?.match(/spore\/([a-zA-Z0-9-]+)/)
  return matches?.[1] || 'browser'
}

export function hasPushSupport () {
  return Promise.resolve(Boolean(globalThis?.window?.PushManager))
}

export function getAppVersion ({ userAgent } = {}) {
  userAgent = userAgent || globalThis?.navigator?.userAgent
  const regex = new RegExp(`(${_appKey})/(?:[a-zA-Z0-9]+/)?([0-9.]+)`)
  const matches = userAgent?.match(regex)
  return matches?.[2]
}

export function getPlatform ({ userAgent } = {}) {
  userAgent = userAgent || globalThis?.navigator?.userAgent

  const isApp = isNativeApp(_appKey, { userAgent })

  if (isApp && isIos({ userAgent })) {
    return 'ios'
  } else if (isApp && isAndroid({ userAgent })) {
    return 'android'
  } else { return 'web' }
}
