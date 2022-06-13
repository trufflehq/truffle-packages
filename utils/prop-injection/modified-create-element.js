import React, { createContext, useContext } from 'react'
// may need this if using patched-react.js
// import React, { createContext, useContext } from 'https://npm.tfl.dev/v86/react@18.2.0-next-47944142f-20220608/es2022/react.js?_truffle'

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
  const context = useContext(TruffleTreePathContext)

  const { truffleTreePath = props?._truffleTreePath } = context || {}
  const childTruffleTreePath = props._truffleTreeSiblingIndex != null
    ? `${truffleTreePath}>${props._truffleTreeSiblingIndex}`
    : truffleTreePath

  const foundComponentInstance = window._truffleComponentInstances?.find(({ treePath }) =>
    // TODO: this should be childTreePath. root component seems wrong
    treePath === truffleTreePath
  )
  if (foundComponentInstance?.props) {
    props = { ...props, ...foundComponentInstance.props }
  }

  return <TruffleTreePathContext.Provider value={{ truffleTreePath: childTruffleTreePath }}>
    {oldCreateElement(element, props, ...children)}
  </TruffleTreePathContext.Provider>
}
