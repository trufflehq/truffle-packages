import React, { lazy, Suspense, useContext, useMemo } from 'https://npm.tfl.dev/react'

import TruffleComponentInstancesContext from './component-instances-context.js'

export default function ComponentInstance ({ componentInstance, ...props }) {
  const { componentInstances } = useContext(TruffleComponentInstancesContext) || {}
  const moduleUrl = componentInstance?.component?.module?.url
  const LoadedComponent = useMemo(() => {
    return moduleUrl
      ? lazy(() => import(moduleUrl))
      : ({ children }) => children
  }, [moduleUrl])

  // NOTE: our patched react only patches createElement, not jsxDEV from jsx-dev-runtime.
  // we'd need to patch jsx-dev-runtime and jsx-runtime for JSX below to work
  // <Component _truffleTreePath="root" {...(rootComponentInstance?.props || {})} />
  // but it's easy enough to just call createElement since we're converting jsx to createElement
  // for all tfl.dev components

  // NOTE: if prop injection breaks, it's because `import { createElement } from 'https://npm.tfl.dev/react'` isn't patched.
  // only `import React from 'https://npm.tfl.dev/react'; React.createElement`. if we need to support the former,
  // we need to importmap from 'https://npm.tfl.dev/react', and the raw react js file on cdn to the patched-react.js.
  // right now we only use React.createElement when creating truffle elements, and we control this
  // (zygote module mutation + compilation-api)
  return (
    <Suspense>
      {/* need to use modified React.createElement so prop injection happens */}
      {React.createElement(LoadedComponent, {
        _truffleTreePath: 'root',
        ...castProps(componentInstance?.props || {}, componentInstances),
        ...props || {}
      })}
    </Suspense>
  )
};

function iterateOverAllInPlace (object, matchFn, fn) {
  // an alternative approach would be to JSON.stringify, catch, and skip if error (circular obj)
  if (React.isValidElement(object) || object._context) return // infinite loop if we try running on react el

  Object.keys(object).forEach((key) => {
    if (matchFn(object[key])) {
      object[key] = fn(object[key])
    } else {
      if (object[key] && typeof object[key] === 'object') {
        iterateOverAllInPlace(object[key], matchFn, fn)
      }
    }
  })
  return object
}

export function castProps (props, componentInstances) {
  return iterateOverAllInPlace(props, (prop) => prop?._castTo, (prop) => castTo(prop, componentInstances))
}

function castTo (prop, componentInstances) {
  if (prop._castTo === 'ComponentInstance') {
    const componentInstance = componentInstances.find(({ id }) =>
      id === prop.id
    )
    return componentInstance && (
      // max callstack error
      React.createElement(ComponentInstance, { componentInstance })
    )
  }
}
