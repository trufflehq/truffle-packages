import { getCookie, setCookie } from 'https://tfl.dev/@truffle/utils@0.0.1/cookie/cookie.js'

export default class Experiment {
  // TODO: have exp cookies only last ~ a month
  constructor () {
    let rand
    let expDefault = getCookie('exp:default')
    if (!expDefault) {
      rand = Math.random()
      expDefault = rand > 0.5
        ? 'visible'
        : 'control'
      setCookie('exp:default', expDefault)
    }

    globalThis?.window?.ga?.('send', 'event', 'exp', `default:${expDefault}`)

    // let expSignUpOverlayBlur = getCookie('exp:signupOverlayBlur')
    // if (!expSignUpOverlayBlur) {
    //   rand = Math.random()
    //   expSignUpOverlayBlur = rand > 0.5
    //     ? 'visible'
    //     : 'control'
    //   setCookie('exp:signupOverlayBlur', expSignUpOverlayBlur)
    // }

    // globalThis?.window?.ga?.('send', 'event', 'exp', `signupOverlayBlur:${expSignUpOverlayBlur}`)

    this.experiments = {
      default: expDefault
      // signupOverlayBlur: expSignUpOverlayBlur
    }
  }

  get = (key) => {
    return this.experiments[key]
  }
}
