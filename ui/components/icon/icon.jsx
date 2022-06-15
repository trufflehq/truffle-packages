import React from 'react'
import _ from 'https://npm.tfl.dev/lodash?no-check'

import classKebab from 'https://tfl.dev/@truffle/utils@0.0.1/legacy/class-kebab.js'

import * as legacyIcons from '../../legacy/icons.js'

import styles from './icon.css' assert { type: 'css' }
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles]

export default function Icon (props) {
  const {
    icon,
    isAlignedTop,
    isAlignedLeft,
    isAlignedRight,
    isAlignedBottom,
    isCircled,
    color,
    onclick,
    onmousedown,
    ontouchstart,
    isCentered,
    hasRipple,
    viewBox = 24,
    heightRatio = 1,
    units = 'px'
  } = props
  let {
    isTouchTarget,
    size = 24,
    touchWidth = '40px',
    touchHeight = '40px'
  } = props

  const isClickable = Boolean(onclick || onmousedown || ontouchstart)

  const Tag = hasRipple ? 'a' : 'div'

  if (isCircled) {
    isTouchTarget = isTouchTarget || true
  }

  return (
    <Tag
      className={'c-icon ' + classKebab({
        isAlignedTop,
        isAlignedLeft,
        isAlignedRight,
        isAlignedBottom,
        isCentered,
        isTouchTarget,
        isClickable,
        isCircled,
        hasRippleWhite: hasRipple && color !== 'var(--truffle-color-text)',
        hasRippleHeader: hasRipple && color === 'var(--truffle-color-text)'
      })}
      tabIndex={hasRipple ? 0 : undefined}
      onClick={onclick}
      onMouseDown={onmousedown}
      onTouchStart={ontouchstart}
      style={{
        minWidth: isTouchTarget ? touchWidth : '0', // 100% makes having a wrapper div necessary
        minHeight: isTouchTarget ? touchHeight : '100%', // nec to center
        width: size,
        height: `${parseInt(size) * heightRatio}${units}`
      }}
    >
      <svg
        namespace="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBox} ${viewBox * heightRatio}`}
        style={{
          width: size,
          height: `${parseInt(size) * heightRatio}${units}`
        }}
      >
        <path
          namespace="http://www.w3.org/2000/svg"
          d={legacyIcons[`${_.camelCase(icon)}IconPath`] ?? icon}
          fill={color}
          fillRule="evenodd"
        />
      </svg>
    </Tag>
  )
}
