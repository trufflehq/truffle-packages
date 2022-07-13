import React from 'https://npm.tfl.dev/react'
import ScopedStylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/scoped-stylesheet/scoped-stylesheet.js"
import Stylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/stylesheet/stylesheet.js"
import jumper from "https://tfl.dev/@truffle/utils@0.0.1/jumper/jumper.js"
import { useEffect, useState } from 'https://npm.tfl.dev/react'
function createIframeStyle(dimensions, globalMouse) {
	function createClipPath(position, base, { top, right, bottom, left }) {
		return `inset(
					${position.y - top}px
					calc(100% - ${position.x + base.x + right}px) 
					calc(100% - ${position.y + base.y + bottom}px) 
					${position.x - left}px)`
	}
	const style = {
		width: "100vw",
		height: "100vh",
		"clip-path": createClipPath(globalMouse, dimensions.base, dimensions.modifiers),
		transition: dimensions.modifiers.transition,
		background: "none",
		position: "fixed",
		top: `0`,
		left: `0`,
		"z-index": "999",
		// overflow: "hidden"
	}
	//remove clip path if mouse is pressed so we get mouse events across the entire page
	if (globalMouse.pressed) style["clip-path"] = "none"
	return style
}
export default function Draggable({ children, dimensions, defaultPosition }) {
	const [globalMouse, setGlobalMouse] = useState(
		{
			...defaultPosition,
			startX: 0, startY: 0,
			pressed: false,
			draggable: true
		}
	)
	//mouse handling
	useEffect(() => {
		const handleWindowMouseMove = event => {
			setGlobalMouse((old) => (
				{
					...old,
					x: (event.clientX) - old.startX,
					y: (event.clientY) - old.startY,
				}
			))
		}
		if (globalMouse.pressed) {
			//initiate drag by adding mousemove listener when mouse is pressed and dragging
			window.addEventListener('mousemove', handleWindowMouseMove)
		} else {
			//if mouse is not pressed, we can't be dragging, remove mouse move listener
			window.removeEventListener('mousemove', handleWindowMouseMove)
		}
		return () => {
			window.removeEventListener('mousemove', handleWindowMouseMove)
		}
	}, [globalMouse.pressed])
	// iframe movement
	useEffect(() => {
		async function setStyles() {
			const style = createIframeStyle(dimensions, globalMouse)
			await jumper.call("layout.applyLayoutConfigSteps", {
				layoutConfigSteps: [
					{ action: "useSubject" }, // start with our iframe
					{ action: "setStyle", value: style },
				],
			})
		}
		setStyles()
	}, [dimensions, globalMouse])
	function positionStyle(x, y) {
		return {
			position: "absolute",
			top: y + "px",
			left: x + "px",
			//disable text selection while dragging
			"user-select": globalMouse.pressed ? "none" : "inherit",
		}
	}
	return (
		<div className='draggable'
			draggable={true}
			style={{
				position: "absolute",
				top: "0px",
				left: "0px"
			}}
			onMouseDown={(e) => {
				//prevent dragging by links and any class that has the prevent-drag class
				if (e.target.tagName === "A" || e.target.className.includes("prevent-drag")) {
					setGlobalMouse((old) => ({ ...old, draggable: false }))
				}
			}}
			onDragStart={(e) => {
				e.preventDefault()
				if (globalMouse.draggable) setGlobalMouse((old) => ({
					...old, pressed: true,
					startX: (e.clientX) - old.x,
					startY: (e.clientY) - old.y
				}))
			}}
			onMouseUp={(e) => {
				setGlobalMouse((old) => ({ ...old, pressed: false, draggable: true }))
			}}
		>
			<div style={positionStyle(globalMouse.x, globalMouse.y)}>
				{children}
			</div>
		</div>
	)
}