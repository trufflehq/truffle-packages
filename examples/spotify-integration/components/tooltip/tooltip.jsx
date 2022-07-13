import React from 'https://npm.tfl.dev/react'
import Stylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/stylesheet/stylesheet.js"
export default function ToolTip({ children, setHoverState, hoverText, className, onClick }) {
	return (
		<>
			<Stylesheet url={new URL("tooltip.css", import.meta.url)} />
			<div
				className={className}
				onMouseOver={() => setHoverState(true)}
				onMouseOut={() => setHoverState(false)}
				onClick={onClick}
				data-hover-text={hoverText}
			>
				{children}
			</div>
		</>
	)
}