import React from 'react'
import { useEffect, useState} from 'react';
import { embed } from '@trufflehq/sdk'
export interface Vector {
  x: number;
  y: number;
}

export interface DragInfo {
  current: Vector;
  start: Vector;
  pressed: boolean;
  dragabble: boolean;
}

export interface Modifiers {
  top: number;
  right: number;
  bottom: number;
  left: number;
  transition: string; //css value for the transition property
}

export interface Dimensions {
  base: Vector;
  modifiers: Modifiers;
}

function createIframeStyle(dimensions: Dimensions, dragInfo: DragInfo) {
  function createClipPath(
    position: Vector,
    base: Vector,
    { top, right, bottom, left }: {[side: string]: number},
  ) {
    return `inset(
					${position.y - top}px
					calc(100% - ${position.x + base.x + right}px) 
					calc(100% - ${position.y + base.y + bottom}px) 
					${position.x - left}px)`;
  }
  //creates an element that spans the entire screen
  //a clip path is used to crop to only the actual component
  const style = {
    width: "100%",
    height: "100%",
    "clip-path": createClipPath(
      dragInfo.current,
      dimensions.base,
      dimensions.modifiers,
    ),
    transition: dimensions.modifiers.transition,
    background: "none",
    position: "fixed",
    top: "0",
    left: "0",
    "z-index": "999",
  };
  //remove clip path if mouse is pressed or if the user is currently moused down on a non draggable item
  // this gives us mouse events across the entire page so we don't lose a mouse up event
  if (dragInfo.pressed || !dragInfo.draggable) style["clip-path"] = "none";
  return style;
}

export default function Draggable(
  { children, dimensions, defaultPosition, requiredClassName, ignoreClassName }:
    {
      children: React.ReactNode;
      dimensions: Dimensions;
      defaultPosition: Vector;
      requiredClassName?: string;
      ignoreClassName?: string;
    },
) {
  const [dragInfo, setDragInfo] = useState<DragInfo>(
    {
      current: defaultPosition,
      start: { x: 0, y: 0 },
      pressed: false,
      draggable: true,
    },
  );

  useEffect(() => {
    const handleWindowMouseMove = (event) => {
      setDragInfo((old: DragInfo) => (
        {
          ...old,
          current: {
            x: (event.clientX) - old.start.x,
            y: (event.clientY) - old.start.y,
          },
        }
      ));
    };
    if (dragInfo.pressed) {
      window.addEventListener("mousemove", handleWindowMouseMove);
    } else {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    }
    return () => (window.removeEventListener(
      "mousemove",
      handleWindowMouseMove,
    ));
  }, [dragInfo.pressed]);

  // use jumper to update the clip path based on the dimensions and drag info
  useEffect(() => {
    const style = createIframeStyle(dimensions, dragInfo);
    embed.setStyles(style);
  }, [dimensions, dragInfo]);

  return (
    //outer div is the full screen div that is cropped with clip path
    <div
      className="draggable"
      draggable={true}
      style={createIframeStyle(dimensions, dragInfo)}
      onMouseDown={(e: { target: Element }) => {
        const target = e.target as Element;
        const classes: string = target.className;
        //prevent dragging by links and any class that has the prevent-drag class
        console.log(classes);
        //multiple events are fired for some reason, this ignores all events triggered by a certain classname
        if (classes.includes(ignoreClassName)) return;
        if (
          requiredClassName && !classes.includes(requiredClassName)
        ) {
          setDragInfo((old: DragInfo) => ({ ...old, draggable: false }));
        }
        if (
          target.tagName === "A" || classes.includes("prevent-drag")
        ) {
          setDragInfo((old: DragInfo) => ({ ...old, draggable: false }));
        }
      }}
      onDragStart={(e) => {
        e.preventDefault();
        if (dragInfo.draggable) {
          setDragInfo((old: DragInfo) => ({
            ...old,
            pressed: true,
            start: {
              x: (e.clientX) - old.current.x,
              y: (e.clientY) - old.current.y,
            },
          }));
        }
      }}
      onMouseUp={(e) => {
        setDragInfo((old: DragInfo) => ({
          ...old,
          pressed: false,
          draggable: true,
        }));
      }}
    >
      <div
        style={{
          //set position of child container
          width: "fit-content",
          position: "absolute",
          top: dragInfo.current.y + "px",
          left: dragInfo.current.x + "px",
          //disable text selection while dragging
          "user-select": dragInfo.pressed ? "none" : "inherit",
        } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
