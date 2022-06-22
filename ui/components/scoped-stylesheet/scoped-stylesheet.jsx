import React from 'react'
import root from "https://npm.tfl.dev/react-shadow@19?deps=react@18&dev";

import Stylesheet from "../stylesheet/stylesheet.jsx"

export default function ScopedStylesheet ({ children, url, element = 'div' }) {
  const ShadowRoot = root[element]
  return (
    <ShadowRoot>
      <Stylesheet url="https://cdn.jsdelivr.net/gh/jgthms/minireset.css@master/minireset.min.css" />
      <Stylesheet url={url} />
      {children}
    </ShadowRoot>
  )
}
