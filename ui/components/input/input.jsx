import React, { useRef } from 'https://npm.tfl.dev/react'
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";

export default function Input ({ value, changeHandler, type = 'text', label, ref }) {
  const $ref = ref ?? useRef()

  return (
    <div className='c-input'>
      <label>
        <div className="c-label">{label}</div>
        <input ref={$ref} type={type} value={value ?? ''} onInput={changeHandler} />
      </label>
    </div>
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
