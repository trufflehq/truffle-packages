import React from 'https://npm.tfl.dev/react'
import root from "https://npm.tfl.dev/react-shadow@19";

import Stylesheet from "../../stylesheet/stylesheet.tag.ts"

// NOTE: ref={ref} in an element inside web component won't work outside of the <ScopedStylesheet>
// we might want to rename ScopedStylesheet to <Encapsulate>
// and have devs include <Stylesheet>s manually
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
