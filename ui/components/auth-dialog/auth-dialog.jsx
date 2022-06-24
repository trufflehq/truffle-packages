import React from 'https://npm.tfl.dev/react'

import Dialog, { Dialog$ } from '../dialog/dialog.jsx'

export default function AuthDialog(props) {
  const DialogElement = props.Dialog || Dialog
  return (
    <DialogElement
      {...props}
      title="title test"
      content="content test"
    />
  )
}

export function AuthDialog$ (props) {
  const newProps = {
    Dialog: Dialog$
  }

  return (
    <AuthDialog {...props} {...newProps} />
  )
}