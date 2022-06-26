import React, { useRef, useLayoutEffect, useState } from 'https://npm.tfl.dev/react'

// w/o the memo, browser css will flash every render if cache is disabled
const MemoizeStylesheet = React.memo(({ url }) => {
  // if in web component, hide until stylesheet is loaded in, to prevent fouc
  const ref = useRef()
  const [isLoaded, setIsLoaded] = useState(false)

  useLayoutEffect(() => {
    ref.current.onload = () => {
      setIsLoaded(true)
    }
  }, [])
  
  return (
    <>
      <style>{`:host { opacity: ${isLoaded ? 'inherit' : '0'} }`}</style>
      <link ref={ref} rel="stylesheet" href={url.toString()} />
    </>
  )
}, (prevProps, nextProps) => prevProps.url.toString() === nextProps.url.toString())

export default MemoizeStylesheet
