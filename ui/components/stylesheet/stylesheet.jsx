import React, { useRef, useLayoutEffect, useState } from 'https://npm.tfl.dev/react'
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

const Stylesheet = ({ url }) => {
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
}

Stylesheet.propTypes = {
  url: PropTypes.string,
}

export default toWebComponent(Stylesheet, { isShadowDom: false })
