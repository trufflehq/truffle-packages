import React from 'https://npm.tfl.dev/react'
import root from "./root/index.js";

const Isolate = React.forwardRef(({ children, element = 'div', ...props }, ref) => {
  const ShadowRoot = root[element]
  return (
    <ShadowRoot ref={ref} {...props}>{children}</ShadowRoot>
  )
})

export default Isolate
