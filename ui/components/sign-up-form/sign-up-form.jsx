import React, { useContext, useMemo } from 'react'
// import { Component, Stream, useStream, Legacy, context } from '@spore/platform'

export default function SignUpForm (props) {
  return <div className="c-sign-up-form">
    Sign up
  </div>
}

export function FIXME (props) { // title
  const {
    onComplete, isLowFriction, initialEmailPhone, prefillName, infoMessage, source = 'other',
    inviteTokenStrObs, isSpore
  } = props

  const { model, lang, browserComms, overlay, cookie } = useContext(context)

  const {
    isLoadingStream, nameStream, nameErrorStream, emailPhoneStream, emailPhoneErrorStream,
    passwordStream, passwordErrorStream, modeStream, hasErrorStream
  } = useMemo(() => {
    globalThis?.window?.ga?.('send', 'event', 'sign_up_sheet', 'open')
    return {
      isLoadingStream: Stream.createStream(false),
      nameStream: Stream.createStream(prefillName ?? ''),
      nameErrorStream: Stream.createStream(null),
      emailPhoneStream: Stream.createStream(initialEmailPhone || ''),
      emailPhoneErrorStream: Stream.createStream(null),
      passwordStream: Stream.createStream(''),
      passwordErrorStream: Stream.createStream(null),
      hasErrorStream: Stream.createStream(false),
      modeStream: props.modeStream || Stream.createStream('join')
    }
  }, [])

  const {
    me, org, isLoading, name, emailPhone, password, mode, inviteTokenStr, hasError
  } = useStream(() => ({
    me: model.user.getMe(),
    org: model.org.getMe(),
    isLoading: isLoadingStream.obs,
    name: nameStream.obs,
    emailPhone: emailPhoneStream.obs,
    password: passwordStream.obs,
    mode: modeStream.obs,
    inviteTokenStr: inviteTokenStrObs,
    hasError: hasErrorStream.obs
  }))

  const onSave = async () => {
    if (isLoading) {
      return
    }
    if (mode === 'join' && !name) {
      // this is allowed server-side, but don't want to allow here
      hasErrorStream.next(true)
      return nameErrorStream.next(lang.get('error.invalidName'))
    }
    nameErrorStream.next(null)
    emailPhoneErrorStream.next(null)
    passwordErrorStream.next(null)
    hasErrorStream.next(false)
    try {
      globalThis?.window?.ga?.('send', 'event', 'sign_up_sheet', 'success')
      if (mode === 'signIn') {
        await model.auth.login({ emailPhone, password })
      } else if (mode === 'reset') {
        await model.auth.resetPassword({ emailPhone })
      } else {
        await model.auth.join({
          name, emailPhone, password, source, inviteTokenStr
        }, { overlay, cookie })
      }
      await new Promise((resolve) => setTimeout(resolve, 0)) // give time for invalidate to work
      await model.user.getMe().pipe(Stream.op.take(1)).toPromise()
      await model.org.getMe().pipe(Stream.op.take(1)).toPromise()
      onComplete?.()
    } catch (error) {
      globalThis?.window?.ga?.('send', 'event', 'sign_up_sheet', 'error', error.info?.langKey)
      console.log('error...', error)
      hasErrorStream.next(true)
      let errorStream
      switch (error.info?.field) {
        case 'name': errorStream = nameErrorStream; break
        case 'emailPhone': errorStream = emailPhoneErrorStream; break
        case 'password': errorStream = passwordErrorStream; break
        default: errorStream = emailPhoneErrorStream; break
      }
      errorStream.next(lang.get(error.info?.langKey || 'error.invalid'))
    }
  }

  const title = props.title || model.org.getChatName(org, lang)
  const isMember = model.user.isMember(me)

  return (
    <div className="z-sign-up-form">
      { !isSpore &&
        <>
          <div className="title">{title}</div>
          <div className="description">
            {
              infoMessage != null
                ? infoMessage
                : lang.get('signUpForm.description', { replacements: { orgName: org?.name } })
            }
          </div>
        </>
      }
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault()
          isLoadingStream.next(true)
          try {
            await onSave()
          } catch (err) {
            console.log('sign up', err)
          }
          // allow onComplete to finish before loading button goes false
          // and allow time for slow components to render
          setTimeout(() =>
            isLoadingStream.next(false)
          , 500)
        }}
      >
        { (!mode || mode === 'join') &&
          <div className="input">
            <Component slug="input"
              props={{
                label: lang.get('general.displayName'),
                valueStream: nameStream,
                errorStream: nameErrorStream,
                // mobile too small/cluttered to bring up keyboard right away
                isAutoFocused: !Legacy.Environment.isMobile(),
                name: 'name'
              }}
            />
          </div>
        }
        <div className="input">
          <Component slug="input"
            props={{
              label: lang.get('general.emailPhone'),
              valueStream: emailPhoneStream,
              errorStream: emailPhoneErrorStream,
              name: 'email'
            }}
          />
        </div>
        { (mode === 'signIn' || !isLowFriction) && mode !== 'reset' &&
          <div className="input">
            <Component slug="input"
              props={{
                label: lang.get('general.password'),
                valueStream: passwordStream,
                errorStream: passwordErrorStream,
                type: 'password',
                name: 'password'
              }}
            />
          </div>
        }
        { isMember &&
          <div
            className="save"
            onClick={() => {
              model.auth.logout()
            }}
          >
            {lang.get('signIn.alreadyLoggedIn')}
          </div>
        }
        { !isMember &&
          <div className="save">
            <Component slug="button"
              props={{
                text: mode === 'reset'
                  ? lang.get('signIn.sendResetLink')
                  : mode === 'signIn'
                    ? lang.get('general.signIn')
                    : lang.get('signIn.join'),
                isLoadingStream,
                isFullWidth: true,
                type: 'submit'
              }}
            />
            { hasError && mode === 'signIn' &&
              <Component slug="button"
                props={{
                  text: lang.get('signIn.resetPassword'),
                  style: 'text',
                  isFullWidth: true,
                  onclick: () => modeStream.next('reset')
                }}
              />
            }
            <div className="terms">
              {
                lang.get('signIn.terms', {
                  replacements: { tos: ' ' }
                })
              }
              <a
                href="/policies"
                target="_system"
                onClick={(e) => {
                  e.preventDefault()
                  return browserComms.call('browser.openWindow', {
                    url: '/policies',
                    target: '_system'
                  })
                }}
              >Terms of Service, Privacy Policy</a>
              { !isSpore &&
                <>
                  {' '}
                  {lang.get('signIn.terms2', { replacements: { orgName: org?.name } })}
                </>
              }
            </div>
          </div>
        }
      </form>
    </div>
  )
}
