// not currently used, see comment in patch-react.js
import React from 'https://npm.tfl.dev/v86/react@18/es2022/react.js?_truffle'
import { createElement as modifiedCreateElement } from './modified-create-element.js'

export default React
export * from 'https://npm.tfl.dev/v86/react@18/es2022/react.js?_truffle'

export const createElement = modifiedCreateElement

React.createElement = modifiedCreateElement
