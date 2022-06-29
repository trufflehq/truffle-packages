import React, { useContext, useLayoutEffect, useRef } from 'https://npm.tfl.dev/react'
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";

import { Context as FormControlContext } from '../form-control/form-control.tsx'
import Isolate from '../isolate/isolate.jsx'
import Stylesheet from '../stylesheet/stylesheet.jsx'

export default function Input (props) {
  const context = useContext(FormControlContext)
  const isInvalid = props.isInvalid ?? context?.isInvalid

  const ref = useRef()

  useLayoutEffect(() => {
    console.log('layout', ref);
  }, [ref])

  return (
    <Isolate>
      <Stylesheet url={new URL('./input.css', import.meta.url)} />
      <input className="input" ref={ref} {...props} />
    </Isolate>
  )
}

export function Input$(props) {
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

  return <Input {...props} {...newProps} />;
}
