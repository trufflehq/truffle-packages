import React from "https://npm.tfl.dev/react";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.4/format/wc/react/index.ts";
import styleSheet from "./tooltip.scss.js";

type ToolTipProps = {
  children: React.ReactNode;
  hoverText: string;
  className: string;
  onClick?: () => void;
  xCoord?: string;
  yCoord?: string;
};
export default function ToolTip(
  { children, hoverText, className, onClick, xCoord = "-90%", yCoord = "0" }:
    ToolTipProps,
) {
  useStyleSheet(styleSheet);
  return (
    <>
      <style>
        {`
        .c-tooltip:hover:after {
          transform: translateY(${yCoord}) translateX(${xCoord});
          //fixes firefox bug?
          @-moz-document url-prefix() {
            transform: translateY(${yCoord}) translateX(${xCoord});
          }
        }
      `}
      </style>
      <div
        className={`c-tooltip ${className}`}
        onClick={onClick}
        data-hover-text={hoverText}
      >
        {children}
      </div>
    </>
  );
}
