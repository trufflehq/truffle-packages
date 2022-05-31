import React from 'react'
import * as _ from 'https://jspm.dev/lodash-es'

import classKebab from 'https://tfl.dev/@truffle/utils@0.0.1/legacy/class-kebab.js'

import * as legacyIcons from '../../legacy/icons.js'
import cssVars from '../../util/css-vars.js'

// import './icon.scss'

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
    heightRatio = 1
  } = props
  let {
    isTouchTarget,
    size = '24px',
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
      className={'z-icon ' + classKebab({
        isAlignedTop,
        isAlignedLeft,
        isAlignedRight,
        isAlignedBottom,
        isCentered,
        isTouchTarget,
        isClickable,
        isCircled,
        hasRippleWhite: hasRipple && color !== cssVars.$bgBaseText,
        hasRippleHeader: hasRipple && color === cssVars.$bgBaseText
      })}
      tabIndex={hasRipple ? 0 : undefined}
      onClick={onclick}
      onMouseDown={onmousedown}
      ontouchstart={ontouchstart}
      style={{
        minWidth: isTouchTarget ? touchWidth : '0', // 100% makes having a wrapper div necessary
        minHeight: isTouchTarget ? touchHeight : '100%', // nec to center
        width: size,
        height:
          size?.indexOf?.('%') !== -1
            ? `${parseInt(size) * heightRatio}%`
            : `${parseInt(size) * heightRatio}px`
      }}
    >
      <svg
        namespace="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBox} ${viewBox * heightRatio}`}
        style={{
          width: size,
          height:
            size?.indexOf?.('%') !== -1
              ? `${parseInt(size) * heightRatio}%`
              : `${parseInt(size) * heightRatio}px`
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
