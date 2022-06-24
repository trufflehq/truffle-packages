import React from 'https://npm.tfl.dev/react'
import root from "https://npm.tfl.dev/react-shadow@19";

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
