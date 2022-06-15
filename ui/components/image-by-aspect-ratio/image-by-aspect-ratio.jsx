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
    width,
    height,
    units = 'px',
    isStretch,
    isCentered,
    shouldContain = true
  } = props

  const hasWidth = width
  const hasHeight = height

  let style
  if (isStretch) {
    style = {
      maxWidth: height ? `${height * aspectRatio}${units}` : `${width}${units}`,
      maxHeight: width ? `${width / aspectRatio}${units}` : `${height}${units}`
    }
  } else {
    style = {
      width: height ? `${height * aspectRatio}${units}` : `${width}${units}`,
      height: width ? `${width / aspectRatio}${units}` : `${height}${units}`
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
            !width && isStretch ? `${(1 / aspectRatio) * 100}%` : undefined,
          paddingLeft:
            width && isStretch ? `${aspectRatio * 100}%` : undefined,
          backgroundImage: `url(${imageUrl})`
        }}
      />
    </div>
  )
}
