// NOTE: if prop injection breaks, it's because `import { createElement } from 'react'` isn't patched.
// only `import React from 'react'; React.createElement`. if we need to support the former,
// we need to importmap from 'react', and the raw react js file on cdn to the patched-react.js.
// right now we only use React.createElement when creating truffle elements, and we control this
// (zygote module mutation + compilation-api

import React from 'react'
import { createElement as modifiedCreateElement } from './modified-create-element.js'

React.createElement = modifiedCreateElement
