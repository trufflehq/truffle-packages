import React from 'https://npm.tfl.dev/react'
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";
import { createSubject } from 'https://tfl.dev/@truffle/utils@0.0.1/obs/subject.js'

export default function Dropdown ({
  valueSubject,
  options
}) {

  const { value } = useObservables(() => ({
    value: valueSubject?.obs ?? createSubject(0) 
  }))

  return (
    <select
      value={value}
      onChange={(e) => valueSubject.next(e.target.value)}
    >
      {
        options.map((option, idx) => typeof option === 'string'
          ? <option value={idx}>{option}</option>
          : <option value={option.value}>{option.name}</option>
        )
      }
    </select>
  )
}