import React from 'react'

export default function ScopedStylesheet ({ children, href }) {
  return (
    <>
      <link
        rel="stylesheet"
        href={new URL(href, import.meta.url).toString()}
      />
      {children}
    </>
  )
}
