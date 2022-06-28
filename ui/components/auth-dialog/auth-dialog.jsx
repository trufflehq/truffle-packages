import React, { useMemo } from 'https://npm.tfl.dev/react'

import { createSubject } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'
import { mutation } from 'https://tfl.dev/@truffle/api@0.0.1/client.js'

import Button from '../button/button.jsx'
import Dialog, { Dialog$ } from '../dialog/dialog.jsx'
import { Input$ } from '../input/input.jsx'
import { useThemeContext } from "../theme/theme-context.js";
import ScopedStylesheet from "../scoped-stylesheet/scoped-stylesheet.jsx";

const JOIN_MUTATION = gql`mutation UserJoin($input: UserJoinInput!) {
  userJoin(input: $input) { accessToken }
}`
const RESET_PASSWORD_MUTATION = gql`mutation UserResetPassword($input: UserResetPasswordInput!) {
  userResetPassword(input: $input) { hasSentResetEmail }
}`
const LOGIN_MUTATION = gql`mutation UserLoginEmailPhone($input: UserLoginEmailPhoneInput!) {
  userLoginEmailPhone(input: $input) { accessToken }
}`

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
  const {
    nameSubject, nameErrorSubject, emailPhoneSubject,
    emailPhoneErrorSubject, passwordSubject, passwordErrorSubject
  } = useMemo(() => {
    return {
      isLoadingSubject: createSubject(false),
      fields: {
        name: {
          valueSubject: createSubject(''),
          errorSubject: createSubject()
        },
        emailPhone: {
          valueSubject: createSubject(''),
          errorSubject: createSubject()
        },
        password: {
          valueSubject: createSubject(''),
          errorSubject: createSubject()
        }
      }
    }
  }, [])

  const onSubmit = async () => {
    if (isLoading) {
      return
    }
    try {
      if (mode === 'signIn') {
        await mutation(LOGIN_MUTATION, {
          input: {
            emailPhone: fields.emailPhone.valueSubject.getValue(),
            password: fields.password.valueSubject.getValue(),
          }
        })
      } else if (mode === 'reset') {
        await mutation(RESET_PASSWORD_MUTATION, {
          input: {
            emailPhone: fields.emailPhone.valueSubject.getValue()
          }
        })
      } else {
        await mutation(JOIN_MUTATION, {
          input: {
            emailPhone: fields.emailPhone.valueSubject.getValue(),
            password: fields.password.valueSubject.getValue(),
          }
        })
      }
    } catch (error) {
      hasErrorSubject.next(true)
      const errorSubject = fields[error.info?.field]?.errorSubject || fields.emailPhone.errorSubject
      // TODO: better error messages
      errorSubject.next(error.info?.langKey || 'Error')
    }
  }

  return <>
    <Input$ label="Display name" valueSubject={nameSubject} />
    <Input$ label="Email or phone #" valueSubject={emailPhoneSubject} />
    <Input$ label="Password" type="password" valueSubject={passwordSubject} />
    <Button text="go" onClick={onSubmit} />
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
