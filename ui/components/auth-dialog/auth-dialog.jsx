import React, { useMemo } from 'https://npm.tfl.dev/react'

import { createSubject } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'

import Button from '../button/button.jsx'
import Dialog, { Dialog$ } from '../dialog/dialog.jsx'
import { Input$ } from '../input/input.jsx'
import { useThemeContext } from "../theme/theme-context.js";
import ScopedStylesheet from "../scoped-stylesheet/scoped-stylesheet.jsx";

export default function AuthDialog(props) {
  const DialogElement = props.Dialog || Dialog
  return (
    <DialogElement
      {...props}
      title="Sign up"
      description={<Description />}
      content={<Content />}
    />
  )
}

function Description () {
  const themeContext = useThemeContext();
  // TODO: helper fn
  const cssUrl = themeContext.components?.dialog.cssUrl ||
    new URL("./auth-dialog.css", import.meta.url);

  return <ScopedStylesheet url={cssUrl}>
    <div className="c-description">
      Already have an account?
      <span className="login-toggle">Login</span>
    </div>
  </ScopedStylesheet>
}

function Content () {
  const { usernameSubject, emailOrPhoneSubject, passwordSubject } = useMemo(() => {
    return {
      usernameSubject: createSubject(''),
      emailOrPhoneSubject: createSubject(''),
      passwordSubject: createSubject('')
    }
  }, [])

  const onSubmit = async () => {
    if (isLoading) {
      return
    }
    if (mode === 'join' && !name) {
    try {
      if (mode === 'signIn') {
        useMutation(LOGIN_MUTATION, {

        })

        await model.auth.login({ emailPhone, password })
      } else if (mode === 'reset') {
        await model.auth.resetPassword({ emailPhone })
      } else {
        await model.auth.join({
          name, emailPhone, password, source, inviteTokenStr
        }, { overlay, cookie })
      }
    } catch (error) {
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

  return <>
    <Input$ label="Display name" valueSubject={usernameSubject} />
    <Input$ label="Email or phone #" valueSubject={emailOrPhoneSubject} />
    <Input$ label="Password" type="password" valueSubject={passwordSubject} />
    <Button text="go" />
  </>
}

export function AuthDialog$ (props) {
  const newProps = {
    Dialog: Dialog$
  }

  return (
    <AuthDialog {...props} {...newProps} />
  )
}
