import React, { useContext } from 'react'

import cssVars from '../../util/css-vars.js'

const DEFAULT_SIZE = 50

export default function Spinner ({ size = DEFAULT_SIZE }) {

  return (
    <div
      className="c-spinner"
      style={{ width: `${size}px`, height: `${size * 0.6}px` }}
    >
      {[0, 1, 2].map(() =>
        <li
          style={{
            border: `${Math.round(size * 0.06)}px solid ${cssVars.$primaryBase}`
          }} />
      )}
    </div>
  )
}
