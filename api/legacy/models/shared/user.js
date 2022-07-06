import _ from 'https://npm.tfl.dev/lodash?no-check'

// import $setNameSheet from '../components/set_name_sheet'
// import $signInDialog from '../components/sign_in_dialog'
// import $signUpSheet from '../components/sign_up_sheet'
import { createSubject } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import { getCookie } from 'https://tfl.dev/@truffle/utils@0.0.1/cookie/cookie.js'

export default class User {
  constructor (options) {
    ({
      auth: this.auth, proxy: this.proxy, graphqlClient: this.graphqlClient, lang: this.lang,
      overlay: this.overlay, apiUrl: this.apiUrl
    } = options)
    this.getMe = this.auth.getMe
    this.isSignInDialogVisibleStream = createSubject(false)
  }

  getById = (id) => {
    return this.auth.stream({
      query: 'query UserGetById($id: ID!) { user(id: $id) { id, name, data { bio }, avatarImage { cdn, prefix, variations { postfix }, ext, data, aspectRatio } } }',
      variables: { id },
      pull: 'user'
    })
  }

  getMeWithOrgUsers = () => {
    return this.auth.stream({
      query: `query UserGetMeOrgUsers {
        me {
          orgUsers {
            nodes {
              roles {
                nodes {
                  name
                  rank
                  permissions {
                    nodes {
                      filters
                      action
                      value
                    }
                  }
                }
              }
              org {
                slug
              }
            }
          }
        }
      }`,
      // variables: {}
      pull: 'me'
    })
  }

  getMeWithHasStripeId = () => {
    return this.auth.stream({
      query: 'query UserGetMeStripeId { me { hasStripeId } }',
      // variables: {}
      pull: 'me'
    })
  }

  unsubscribeEmail = ({ userId, tokenStr }) => {
    console.log('user', userId, tokenStr)
    return this.auth.call({
      query: `
        mutation UserUnsubscribeEmail($userId: ID!, $tokenStr: String!) {
          userUnsubscribeEmail(userId: $userId, tokenStr: $tokenStr)
        }`,
      variables: { userId, tokenStr }
    })
  }

  verifyEmail = ({ userId, tokenStr }) => {
    return this.auth.call({
      query: `
        mutation UserVerifyEmail($userId: ID!, $tokenStr: String!) {
          userVerifyEmail(userId: $userId, tokenStr: $tokenStr): Boolean
        }`,
      variables: { userId, tokenStr }
    })
  }

  resetStripeInfo = () => {
    return this.auth.call({
      query: `
        mutation UserResetStripeInfo {
          userResetStripeInfo
        }`,
      // variables: {},
      pull: 'userResetStripeInfo'
    }, { invalidateAll: true })
  }

  setName = (name) => {
    const referrer = getCookie('referrer')

    return this.auth.call({
      query: `
        mutation UserSetName($name: String!, $referrer: String) {
          userSetName(name: $name, referrer: $referrer)
        }`,
      variables: { name, referrer }
    }, { invalidateAll: true })
  }

  resendVerficationEmail = () => {
    return this.auth.call({
      query: `
        mutation UserResendVerficationEmail {
          userResendVerficationEmail: Boolean
        }
        `
    })
  }

  // returns true if the user had to go through login flow
  requestLoginIfGuest = async (user, overlay, { requestPassword = true, props, $el } = {}) => {
    return new Promise((resolve, reject) => {
      if (this.isMember(user) && user?.name) {
        resolve(false)
      } else {
        // FIXME
        // const $el = requestPassword && !user?.hasPassword
        //   ? $signInDialog
        //   : this.isMember(user) && !user?.name
        //     ? $setNameSheet
        //     : $signUpSheet
        overlay.open($el, _.defaults(props, { initialMode: 'join' }), {
          onComplete: () => {
            props?.onComplete?.()
            resolve(true)
          },
          onCancel: reject
        })
      }
    })
  }

  // returns true if the user had to go through name set flow
  // TODO: make sure there's an option to sign up or login too
  requestNameIfGuest = async (user, overlay) => {
    throw new Error('Unsupported')
    // return new Promise((resolve, reject) => {
    //   if (user?.name) {
    //     resolve(false)
    //   } else {
    //     overlay.open($setNameSheet, {}, {
    //       onComplete: () => resolve(true),
    //       onCancel: reject
    //     })
    //   }
    // })
  }

  upsert = async ({ name, email, phone, password, currentPassword, passwordResetKey }, { file } = {}) => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file, file.name)

      const response = await this.proxy(this.apiUrl + '/upload', {
        method: 'POST',
        query: {
          graphqlQuery: `
            mutation UserUpsert($name: String, $email: String, $phone: String, $password: String, $currentPassword: String, $passwordResetKey: String) {
              userUpsert(name: $name, email: $email, phone: $phone, password: $password, currentPassword: $currentPassword, passwordResetKey: $passwordResetKey) {
                id
              }
            }`,
          variables: JSON.stringify({ name, email, phone, password, currentPassword, passwordResetKey })
        },
        body: formData
      })
      // this (graphqlClient.update) doesn't actually work... it'd be nice
      // but it doesn't update existing streams
      // .then @graphqlClient.update
      setTimeout(this.graphqlClient.invalidateAll, 0)
      return response
    } else {
      return this.auth.call({
        query: `
          mutation UserUpsert($name: String, $email: String, $phone: String, $password: String, $currentPassword: String, $passwordResetKey: String) {
            userUpsert(name: $name, email: $email, phone: $phone, password: $password, currentPassword: $currentPassword, passwordResetKey: $passwordResetKey) {
              id
            }
          }`,
        variables: { name, email, phone, password, currentPassword, passwordResetKey }
      }, { invalidateAll: true })
    }
  }

  getDisplayName = (user, { botUser } = {}) => {
    return user?.name || botUser?.name || this.lang.get('general.anonymous')
  }

  getFirstName = (user) => {
    return user?.name
      ? user.name.split(' ')?.[0]
      : this.lang.get('general.boss')
  }

  isMember = (user) => {
    return Boolean(user?.email || user?.phone)
  }
}
