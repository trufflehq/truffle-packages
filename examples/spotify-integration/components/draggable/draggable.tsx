import React from 'https://npm.tfl.dev/react'
import Stylesheet from "https://tfl.dev/@truffle/ui@^0.0.3/components/stylesheet/stylesheet.tag.ts"
import jumper from "https://tfl.dev/@truffle/utils@0.0.1/jumper/jumper.js"
import { useEffect, useState, JSX } from 'https://npm.tfl.dev/react'

export interface Vector{
	x: number,
	y: number
}

export interface DragInfo{
	current: Vector
	start: Vector,
	pressed: boolean,
	dragabble: boolean
}

export interface Modifiers{
	top: number,
	right: number,
	bottom: number,
	left: number,
	transition: string //css value for the transition property
}

export interface Dimensions{
	base: Vector,
	modifiers: Modifiers,
}

function createIframeStyle(dimensions: Dimensions, dragInfo: DragInfo) {
	function createClipPath(position: Vector, base: Vector, { top, right, bottom, left }) {
		return `inset(
					${position.y - top}px
					calc(100% - ${position.x + base.x + right}px) 
					calc(100% - ${position.y + base.y + bottom}px) 
					${position.x - left}px)`
	}
	//creates an element that spans the entire screen
	//a clip path is used to crop to only the actual component
	const style = {
		width: "100vw",
		height: "100vh",
		"clip-path": createClipPath(dragInfo.current, dimensions.base, dimensions.modifiers),
		transition: dimensions.modifiers.transition,
		background: "none",
		position: "fixed",
		top: "0", left: "0",
		"z-index": "999",
	}
	//remove clip path if mouse is pressed so we get mouse events across the entire page
	if (dragInfo.pressed) style["clip-path"] = "none"
	return style
}
export default function Draggable(
	{ children, dimensions, defaultPosition } : 
	{ children: JSX.ReactNode, dimensions: Dimensions, defaultPosition: Vector }) {
	const [dragInfo, setDragInfo] = useState<DragInfo>(
		{
			...defaultPosition,
			start: {x: 0, y: 0},
			pressed: false,
			draggable: true
		}
	)
	//mouse handling
	useEffect(() => {
		const handleWindowMouseMove = event => {
			setDragInfo((old: DragInfo) => (
				{
					...old,
					current: {
						x: (event.clientX) - old.start.x,
						y: (event.clientY) - old.start.y
					}
				}
			))
		}
		if (dragInfo.pressed) {
			//initiate drag by adding mousemove listener when mouse is pressed and dragging
			window.addEventListener('mousemove', handleWindowMouseMove)
		} else {
			//if mouse is not pressed, we can't be dragging, remove mouse move listener
			window.removeEventListener('mousemove', handleWindowMouseMove)
		}
		return () => {
			window.removeEventListener('mousemove', handleWindowMouseMove)
		}
	}, [dragInfo.pressed])

	// use jumper to update the clip path based on the dimensions and drag info
	useEffect(() => {
		const style = createIframeStyle(dimensions, dragInfo)
		jumper.call("layout.applyLayoutConfigSteps", {
				layoutConfigSteps: [
					{ action: "useSubject" }, // start with our iframe
					{ action: "setStyle", value: style },
				],
			})
	}, [dimensions, dragInfo])


	return (
		//outer div is the full screen div that is cropped with clip path
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
					setDragInfo((old: DragInfo) => ({ ...old, draggable: false }))
				}
			}}
			onDragStart={(e) => {
				e.preventDefault()
				if (dragInfo.draggable) setDragInfo((old: DragInfo) => ({
					...old, pressed: true,
					start: {
						x: (e.clientX) - old.current.x,
						y: (e.clientY) - old.current.y
					}
				}))
			}}
			onMouseUp={() => {
				setDragInfo((old: DragInfo) => ({ ...old, pressed: false, draggable: true }))
			}}
		>
			<div style={{
				//set position of child container
				position: "absolute",
				top: dragInfo.current.y + "px",
				left: dragInfo.current.x + "px",
				//disable text selection while dragging
				"user-select": dragInfo.pressed ? "none" : "inherit",
			}}>
				{children}
			</div>
		</div>
	)
}