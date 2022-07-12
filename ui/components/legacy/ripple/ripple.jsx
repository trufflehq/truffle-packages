import React, { useRef } from 'https://npm.tfl.dev/react'
import { isAndroid } from 'https://tfl.dev/@truffle/utils@~0.0.2/environment/environment.js'
import classKebab from 'https://tfl.dev/@truffle/utils@~0.0.2/legacy/class-kebab.js'

// import styles from './ripple.css' assert { type: 'css' }
// document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles]

const ANIMATION_TIME_MS = 350

function ripple ({ $$target, color, isCenter, mouseX, mouseY, onComplete, fadeIn }) {
  const $$wave = $$target.querySelector('.wave')

  if (!$$wave) {
    return
  }

  const { width, height, top, left } = $$target.getBoundingClientRect()

  let x, y

  if (isCenter) {
    x = width / 2
    y = height / 2
  } else {
    x = mouseX - left
    y = mouseY - top
  }

  $$wave.style.top = y + 'px'
  $$wave.style.left = x + 'px'
  $$wave.style.backgroundColor = color
  $$wave.className = fadeIn ? 'wave fade-in is-visible' : 'wave is-visible'

  return new Promise((resolve, reject) =>
    setTimeout(() => {
      onComplete && onComplete()
      resolve()
      setTimeout(() => {
        $$wave.className = 'wave'
      }, 100)
    }, ANIMATION_TIME_MS)
  ) // give some time for onComplete to render
}

export default function Ripple (props) {
  const { color, isCircle, isCenter, onComplete, fadeIn } = props

  const $$ref = useRef()

  function onTouch (e) {
    const $$target = e.target
    ripple({
      $$target,
      color,
      isCenter,
      onComplete,
      fadeIn,
      mouseX: e.clientX || e.touches?.[0]?.clientX,
      mouseY: e.clientY || e.touches?.[0]?.clientY
    })
  }

  return (
    <div
      className={'c-ripple ' + classKebab({ isCircle })}
      ref={$$ref}
      onTouchStart={onTouch}
      onMouseDown={isAndroid() ? null : onTouch}
    >
      <div className="wave" />
    </div>
  )
}
