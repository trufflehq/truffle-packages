import Jumper from './jumper-base.js'
import PushService from '../push/push.js'

const LOCAL_STORAGE_PREFIX = 'truffle'
const PLATFORMS = {
  APP: 'app',
  WEB: 'web'
}

class JumperInstance {
  constructor () {
    if (typeof window !== 'undefined') {
      // TODO: setup service worker so it actually responds and doesn't timeout
      // when you're enabling this, test that it doesn't slow down the
      // first browsercomms call in browser extension
      const shouldConnectToServiceWorker = false
      // const shouldConnectToServiceWorker = navigator.serviceWorker &&
      //   typeof window !== 'undefined' &&
      //   window.location.protocol !== 'http:'
      this.jumper = new Jumper({
        shouldConnectToServiceWorker
        // TODO: check isParentValid
      })

      this.appResumeHandler = null
    }
  }

  call = (...args) => {
    if (typeof window === 'undefined' || window === null) {
      // throw new Error 'Comms called server-side'
      return console.log('Comms called server-side')
    }

    return this.jumper.call(...args)
      .catch((err) => {
      // if we don't catch, zorium freaks out if a jumper call is in state
      // (infinite errors on page load/route)
        // FIXME: re-enable
        // console.log('missing jumper call', args)
        if (err.message !== 'Method not found') {
          console.log(err)
        }
        return null
      })
  }

  callWithError = (...args) => {
    if (typeof window === 'undefined' || window === null) {
      // throw new Error 'Comms called server-side'
      return console.log('Comms called server-side')
    }

    return this.jumper.call(...Array.from(args || []))
  }

  listen = () => {
    if (typeof window === 'undefined' || window === null) {
      throw new Error('Comms called server-side')
    }

    this.jumper.listen()

    this.jumper.on('auth.getStatus', this.authGetStatus)
    this.jumper.on('env.getPlatform', this.getPlatform)

    // fallbacks
    this.jumper.on('app.onResume', this.appOnResume)

    this.jumper.on('push.register', this.pushRegister)

    this.jumper.on('networkInformation.onOnline', this.networkInformationOnOnline)
    this.jumper.on('networkInformation.onOffline', this.networkInformationOnOffline)
    this.jumper.on('networkInformation.onOnline', this.networkInformationOnOnline)

    this.jumper.on('storage.get', this.storageGet)
    this.jumper.on('storage.set', this.storageSet)

    return this.jumper.on('browser.openWindow', ({ url, target, options }) => window.open(url, target, options))
  }

  /*
  @typedef AuthStatus
  @property {String} accessToken
  @property {String} userId
  */

  /*
  @returns {Promise<AuthStatus>}
  */
  authGetStatus = async () => {
    const user = await this.model.user.getMe().take(1).toPromise()
    return {
      // Temporary
      accessToken: user.id,

      userId: user.id
    }
  }

  getPlatform = (param) => {
    // const { userAgent } = navigator
    switch (false) {
      // case !Environment.isNativeApp({ userAgent }):
      //   return this.PLATFORMS.APP
      default:
        return PLATFORMS.WEB
    }
  }

  isChrome () {
    return navigator.userAgent.match(/chrome/i)
  }

  appOnResume = (callback) => {
    if (this.appResumeHandler) {
      window.removeEventListener('visibilitychange', this.appResumeHandler)
    }

    this.appResumeHandler = function () {
      if (!document.hidden) {
        return callback()
      }
    }

    return window.addEventListener('visibilitychange', this.appResumeHandler)
  }

  pushRegister () {
    return PushService.registerWeb()
  }
  // navigator.serviceWorker.ready.then (serviceWorkerRegistration) =>
  //   serviceWorkerRegistration.pushManager.subscribe {
  //     userVisibleOnly: true,
  //     applicationServerKey: urlBase64ToUint8Array config.VAPID_PUBLIC_KEY
  //   }
  //   .then (subscription) ->
  //     subscriptionToken = JSON.stringify subscription
  //     {tokenStr: subscriptionToken, sourceType: 'web'}
  //   .catch (err) =>
  //     serviceWorkerRegistration.pushManager.getSubscription()
  //     .then (subscription) ->
  //       subscription.unsubscribe()
  //     .then =>
  //       unless isSecondAttempt
  //         @pushRegister true
  //     .catch (err) ->
  //       console.log err

  networkInformationOnOnline (fn) {
    return window.addEventListener('online', fn)
  }

  networkInformationOnOffline (fn) {
    return window.addEventListener('offline', fn)
  }

  storageGet = ({ key }) => {
    return window.localStorage.getItem(`${LOCAL_STORAGE_PREFIX}:${key}`)
  }

  storageSet = ({ key, value }) => {
    window.localStorage.setItem(`${LOCAL_STORAGE_PREFIX}:${key}`, value)
  }
}

const jumper = new JumperInstance()
if (typeof window !== 'undefined') {
  jumper.listen()
}

export default jumper
