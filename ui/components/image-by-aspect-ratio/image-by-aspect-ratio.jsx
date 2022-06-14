import React from 'react'

import classKebab from 'https://tfl.dev/@truffle/utils@0.0.1/legacy/class-kebab.js'

import styles from './image-by-aspect-ratio.css' assert { type: 'css' }
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles]

// note that you can't do aspect ratio by height with padding-left
// https://stackoverflow.com/questions/26438388/maintain-div-aspect-ratio-according-to-height
export default function $imageByAspectRatio (props) {
  const {
    imageUrl,
    aspectRatio,
    widthPx,
    heightPx,
    isStretch,
    isCentered,
    shouldContain = true
  } = props

  const hasWidth = widthPx
  const hasHeight = heightPx

  let style
  if (isStretch) {
    style = {
      maxWidth: heightPx ? `${heightPx * aspectRatio}px` : `${widthPx}px`,
      maxHeight: widthPx ? `${widthPx / aspectRatio}px` : `${heightPx}px`
    }
  } else {
    style = {
      width: heightPx ? `${heightPx * aspectRatio}px` : `${widthPx}px`,
      height: widthPx ? `${widthPx / aspectRatio}px` : `${heightPx}px`
    }
  }

  return (
    <div
      className={'c-image-by-aspect-ratio ' + classKebab({
        isCentered,
        isStretch,
        hasWidth,
        hasHeight,
        shouldContain
      })}
      style={style}
    >
      <div
        className="image"
        style={{
          paddingBottom:
            !widthPx && isStretch ? `${(1 / aspectRatio) * 100}%` : undefined,
          paddingLeft:
            widthPx && isStretch ? `${aspectRatio * 100}%` : undefined,
          backgroundImage: `url(${imageUrl})`
        }}
      />
    </div>
  )
}
