import React, { useRef } from 'https://npm.tfl.dev/react'
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";

export default function Input ({ valueSubject, type = 'text', label, ref }) {
  const { currentValue } = useObservables(() => ({
    currentValue: valueSubject?.obs
  }))

  const changeHandler = (e) => {
    valueSubject?.next(e.target.value)
  }

  const $ref = ref ?? useRef()

  return (
    <div className='c-input'>
      { label && <label>{label}</label>}
      <input ref={$ref} type={type} value={currentValue ?? ''} onInput={changeHandler} />
    </div>
  )
}
