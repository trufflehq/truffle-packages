import React, { useContext, useLayoutEffect, useRef } from 'https://npm.tfl.dev/react'
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";

import { Context as FormControlContext } from '../form-control/form-control.tsx'
import Isolate from '../isolate/isolate.jsx'
import Stylesheet from '../stylesheet/stylesheet.jsx'

const Input = React.forwardRef(function Input (props, ref) {
  const context = useContext(FormControlContext)
  const isInvalid = props.isInvalid ?? context?.isInvalid

  return (
    <Isolate>
      <Stylesheet url={new URL('./input.css', import.meta.url)} />
      <input className="input" ref={ref} {...props} />
    </Isolate>
  )
})

export default Input

export const Input$ = React.forwardRef(function Input$(props, ref) {
  const { valueSubject } = props;

  const { value } = useObservables(() => ({
    value: valueSubject?.obs
  }))

  const onChange = (e) => {
    valueSubject?.next(e.target.value)
  }

  const newProps = {
    value,
    onChange,
  };

  return <Input ref={ref} {...props} {...newProps} />;
})
