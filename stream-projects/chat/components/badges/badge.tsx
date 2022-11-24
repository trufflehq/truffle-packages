import { React, useStyleSheet } from "../../deps.ts";
import TooltipWrapper from "../tooltip/tooltip-wrapper.tsx";
import stylesheet from "./badge.scss.js";

export default function Badge(
  { src, tooltip }: {
    src: string;
    tooltip: string;
  },
) {
  useStyleSheet(stylesheet);
  return (
    <TooltipWrapper position="top" align="left" tooltip={tooltip}>
      <img className="badge" src={src} />
    </TooltipWrapper>
  );
}
