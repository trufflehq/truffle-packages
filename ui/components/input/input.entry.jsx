import React, { useContext } from 'https://npm.tfl.dev/react'
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js"

import { Context as FormControlContext } from '../form-control/form-control.tsx'
import Stylesheet from '../stylesheet/stylesheet.jsx'

function Input ({ reactRef, handleChange, ...props }) {
  const context = useContext(FormControlContext)
  const isInvalid = props.isInvalid ?? context?.isInvalid

  return (
    <>
      <Stylesheet url={new URL('./input.css', import.meta.url)} />
      <input className="input" ref={reactRef} onInput={(e) => handleChange?.(e.nativeEvent || e)} {...props} />
    </>
  )
}

Input.propTypes = {
  handleChange: PropTypes.func,
  // https://stackoverflow.com/a/51127130
  reactRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType })
  ])
};

export default toWebComponent(Input)
