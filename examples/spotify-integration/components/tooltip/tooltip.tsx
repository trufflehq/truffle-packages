import React from "https://npm.tfl.dev/react";
import { JSX } from "https://npm.tfl.dev/react";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.19/format/wc/react/index.ts";
import styleSheet from "./tooltip.scss.js";
export default function ToolTip(
  { children, setHoverState, hoverText, className, onClick }: {
    children: JSX.ReactNode;
    setHoverState: Function;
    hoverText: string;
    className: string;
    onClick?: any;
  },
) {
  useStyleSheet(styleSheet);
  return (
    <>
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
  );
}
