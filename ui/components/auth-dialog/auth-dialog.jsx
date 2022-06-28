import React, { useMemo } from 'https://npm.tfl.dev/react'

import { createSubject } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'

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

function Description (props) {
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

function Content (props) {
  const { usernameSubject, emailOrPhoneSubject, passwordSubject } = useMemo(() => {
    return {
      usernameSubject: createSubject(''),
      emailOrPhoneSubject: createSubject(''),
      passwordSubject: createSubject('')
    }
  }, [])

  return <>
    <Input$ label="Display name" valueSubject={usernameSubject} />
    <Input$ label="Email or phone #" valueSubject={emailOrPhoneSubject} />
    <Input$ label="Password" type="password" valueSubject={passwordSubject} />
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