import React from 'react'
import root from "https://npm.tfl.dev/react-shadow@19?deps=react@18&dev";

export default function ScopedStylesheet ({ children, url, element = 'div' }) {
  const ShadowRoot = root[element]
  return (
    <ShadowRoot>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/jgthms/minireset.css@master/minireset.min.css"
      />
      <link
        rel="stylesheet"
        href={url.toString()}
      />
      {children}
    </ShadowRoot>
  )
}
