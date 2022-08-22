import { React, useStyleSheet } from '../../deps.ts'
import stylesheet from './loading-spinner.scss.js'

export default function LoadingSpinner({ size = 24 }: {size?: number}) {

  useStyleSheet(stylesheet)
  const radius = size / 8
  const x1 = size / 3 - radius
  const x2 = size * 2 / 3 - radius
  const x3 = size - radius
  const y = size / 2
  const viewbox = `0 0 ${size} ${size}`
  return <svg className="c-loading-spinner" 
  version="1.1"
  id="L4"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  x="0px" y="0px"
  width={`${size}px`}
  height={`${size}px`}
  viewBox={viewbox} enable-background="new 0 0 0 0" xml:space="preserve">
  <circle fill="#fff" stroke="none" cx={x1} cy={y} r={radius}>
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite"
      begin="0.1"/>    
  </circle>
  <circle fill="#fff" stroke="none" cx={x2} cy={y} r={radius}>
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite" 
      begin="0.2"/>       
  </circle>
  <circle fill="#fff" stroke="none" cx={x3} cy={y} r={radius}>
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite" 
      begin="0.3"/>     
  </circle>
</svg>

}