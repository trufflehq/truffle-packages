import React, { useContext } from 'https://npm.tfl.dev/react'
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js"

// FIXME: react context doesn't work between web components
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

export const propTypes = {
  id: PropTypes.string,
  id2: PropTypes.string,
  handleChange: PropTypes.func,
  type: PropTypes.string,
  // https://stackoverflow.com/a/51127130
  reactRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType })
  ])
};
Input.propTypes = propTypes

export default toWebComponent(Input)
