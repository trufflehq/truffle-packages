import React, { useRef } from 'https://npm.tfl.dev/react'
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";

import ScopedStylesheet from "../scoped-stylesheet/scoped-stylesheet.jsx";

export default function Input ({ value, changeHandler, type = 'text', label, ref }) {
  const $ref = ref ?? useRef()

  return (
    <ScopedStylesheet url={new URL('./input.css', import.meta.url)}>
      <label className="label-wrapper">
        <div className="label">{label}</div>
        <input className="input" ref={$ref} type={type} value={value ?? ''} onInput={changeHandler} />
      </label>
    </ScopedStylesheet>
  )
}

export function Input$(props) {
  const { valueSubject } = props;

  const { value } = useObservables(() => ({
    value: valueSubject?.obs
  }))

  const changeHandler = (e) => {
    valueSubject?.next(e.target.value)
  }

  const newProps = {
    value,
    changeHandler,
  };

  return <Input {...props} {...newProps} />;
}
