import React from 'https://npm.tfl.dev/react'
import root from "./root/index.js";

// NOTE: ref={ref} inside of an <Isolate> will be delayed more than normal
// eg. function () {
//   const ref = useRef()
//
//   useEffect(() => {
//     console.log(ref.current) // will be undefined
//     setTimeout(() => console.log(ref.current), 0) // will be defined
//   }, [])
//
//   return <Isolate><div ref={ref} /></Isolate>
// }
//
// if the <Isolate> was just another <div>, the first ref.current log would be defined
// this is because the element children get portaled into doesn't exist until useEffect
// here: https://github.com/Wildhoney/ReactShadow/blob/1fdd2c8d87441483dfa3fa8d3dc437de4e722d1b/src/core/index.js#L39
// https://github.com/Wildhoney/ReactShadow/blob/1fdd2c8d87441483dfa3fa8d3dc437de4e722d1b/src/core/index.js#L55

const Isolate = React.forwardRef(({ children, element = 'div', ...props }, ref) => {
  const ShadowRoot = root[element]
  return (
    <ShadowRoot ref={ref} {...props}>{children}</ShadowRoot>
  )
})

export default Isolate
