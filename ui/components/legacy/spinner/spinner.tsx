import React from 'https://npm.tfl.dev/react'
import toDist from "https://tfl.dev/@truffle/utils@~0.0.2/web-component/to-web-component.ts";

// import cssVars from '../../util/css-vars.js'

// import styles from './spinner.css' assert { type: 'css' }
// document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles]

const DEFAULT_SIZE = 50

export default toDist(function Spinner ({ size = DEFAULT_SIZE }) {
  return (
    <div
      className="c-spinner"
      style={{ width: `${size}px`, height: `${size * 0.6}px` }}
    >
      {[0, 1, 2].map((i) =>
        <li
          key={i}
          style={{
            border: `${Math.round(size * 0.06)}px solid var(--truffle-color-bg-secondary)`
          }} />
      )}
    </div>
  )
})
