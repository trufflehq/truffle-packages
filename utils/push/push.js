import { isNativeApp, isAndroid, isIos, getAppKey } from '../environment/environment.js'
import { getCookie, setCookie } from '../cookie/cookie.js'

const ONE_DAY_MS = 3600 * 24 * 1000

class PushService {
  constructor () {
    if (globalThis?.window && !isNativeApp()) {
      this.isReady = new Promise((resolve) => { this.resolveReady = resolve })
    }
  }

  setFirebaseInfo = (firebaseInfo) => {
    this.firebaseInfo = firebaseInfo
    this.isFirebaseImported = Promise.all([
      import('https://jspm.dev/firebase/app'),
      import('https://jspm.dev/firebase/messaging')
    ])
      .then(([firebase, firebaseMessaging]) => {
        try {
          firebase.default.initializeApp(this.firebaseInfo)
          this.firebaseMessaging = firebase.default.messaging()
        } catch (err) { console.log('firebase err') }
      })
  }

  setFirebaseServiceWorker = (registration) => {
    if (this.isFirebaseImported) {
      return this.isFirebaseImported.then(() => {
        this.firebaseMessaging?.useServiceWorker(registration)
        return this.resolveReady?.()
      })
    }
  }

  init ({ model, browserComms }) {
    function onReply (reply) {
      const payload = reply.additionalData.payload || reply.additionalData.data
      if (payload.chatId) {
        return model.chatMessage.create({
          body: reply.additionalData.inlineReply,
          parentType: 'chat',
          parentId: payload.chatId
        })
      }
    }

    return browserComms.call('push.registerAction', {
      action: 'reply'
    }, onReply)
  }

  register ({ model, browserComms, isAlwaysCalled }) {
    console.log('registerrrrr')
    return Promise.all([
      browserComms.call('push.register'),
      browserComms.call('app.getDeviceId')
      // .catch(() => null)
    ])
      .then(([{ token, sourceType }, deviceId]) => {
        if (token != null) {
          if (!isAlwaysCalled || !getCookie('hasPushToken')) {
            if (sourceType == null) {
              sourceType = isAndroid() && isNativeApp()
                ? 'android-fcm'
                : isIos() && isNativeApp()
                  ? 'ios-fcm'
                  : 'web-fcm'
            }
            console.log('upsert', token, sourceType, deviceId)
            model.pushToken.upsert({
              tokenStr: token,
              sourceType,
              deviceId,
              appKey: getAppKey()
            })
            setCookie('hasPushToken', 1, { ttlMs: ONE_DAY_MS })
          }

          return model.pushToken.setCurrentPushToken(token)
        }
      }).catch(function (err) {
        if (err.message !== 'Method not found') {
          return console.log(err)
        }
      })
  }

  registerWeb = async () => {
    console.log('register web', this.isReady)
    await this.isReady
    console.log('ready')
    await this.firebaseMessaging.requestPermission()
    const token = await this.firebaseMessaging.getToken()
    console.log('TOKEN', { token, sourceType: 'web-fcm' })
    return { token, sourceType: 'web-fcm' }
  }
}

// subscribeToTopic: ({model, topic, token}) =>
//   if token
//     tokenPromise = Promise.resolve token
//   else
//     tokenPromise = @firebaseMessaging.getToken()
//
//   tokenPromise
//   .then (token) ->
//     model.pushTopic.subscribe {topic, token}
//   .catch (err) ->
//     console.log 'caught', err

export default new PushService()
