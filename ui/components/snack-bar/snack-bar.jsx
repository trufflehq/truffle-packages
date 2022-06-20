import React from 'react'
import root from 'https://npm.tfl.dev/react-shadow@19?deps=react@18&dev'

const DEFAULT_VISIBILITY_DURATION_MS = 4000
const DEFAULT_FADE_DURATION = 500

export default function SnackBar ({
  message,
  value,
  messageTextColor,
  messageBgColor,
  valueTextColor,
  valueBgColor,
  style = 'default', // default | flat
  className,
  visibilityDuration = DEFAULT_VISIBILITY_DURATION_MS,
  fadeDuration = DEFAULT_FADE_DURATION
}) {
  const fadeOutDelay = visibilityDuration + fadeDuration
  return (
    <root.div>
      <link
        rel="stylesheet"
        href={new URL('snack-bar.css', import.meta.url).toString()}
      />
      <div
        className={`c-snack-bar-el ${style} ${className}`}
        style={{
          animation: `slideIn linear ${fadeDuration}ms, stayVisible linear ${visibilityDuration}ms ${fadeDuration}ms, slideOut linear ${fadeDuration}ms ${fadeOutDelay}ms`
        }}
      >
        <div className='message'
          style={{
            background: messageBgColor,
            color: messageTextColor
          }}
        >{ message }</div>
        <div className='value'
          style={{
            background: valueBgColor,
            color: valueTextColor
          }}
        >{ value }</div>
      </div>
    </root.div>
  )
}
