import React, { createContext, useContext } from 'react'
// may need this if using patched-react.js
// import React, { createContext, useContext } from 'https://npm.tfl.dev/v86/react@18/es2022/react.js?_truffle'

import TruffleComponentInstancesContext from './component-instances-context.js'
import { castProps } from './component-instance.jsx'

const TruffleTreePathContext = createContext()

const oldCreateElement = React.createElement

export const createElement = function (element, props, ...children) {
  if (props?._truffleTreeSiblingIndex || props?._truffleTreePath) {
    // wrap with <TruffleComponentWrapper /> to track treePath for injecting props
    return oldCreateElement(TruffleComponentWrapper, { childComponent: { element, props, children } })
  }
  return oldCreateElement(element, props, ...children)
}

function TruffleComponentWrapper ({ childComponent }) {
  const { element, children } = childComponent
  let { props } = childComponent
  // NOTE: haven't tested since switching from storing componentInstances on window -> context
  const { truffleTreePath = props?._truffleTreePath } = useContext(TruffleTreePathContext) || {}
  const { componentInstances } = useContext(TruffleComponentInstancesContext) || {}
  const childTruffleTreePath = props._truffleTreeSiblingIndex != null
    ? `${truffleTreePath}>${props._truffleTreeSiblingIndex}`
    : truffleTreePath

  const foundComponentInstance = componentInstances?.find(({ treePath }) =>
    // TODO: this should be childTruffleTreePath. root component seems wrong
    treePath === childTruffleTreePath
  )
  if (foundComponentInstance?.props) {
    props = { ...props, ...castProps(foundComponentInstance.props, componentInstances) }
  }

  return <TruffleTreePathContext.Provider value={{ truffleTreePath: childTruffleTreePath }}>
    {oldCreateElement(element, props, ...children)}
  </TruffleTreePathContext.Provider>
}
