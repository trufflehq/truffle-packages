import { classKebab, React, useStyleSheet } from "../../deps.ts";
import stylesheet from './tooltip-wrapper.scss.js'
export default function TooltipWrapper(
  { children, tooltip, position = "top", align = "center" }: {
    children: React.ReactNode;
    tooltip: React.ReactNode;
    position?: "top" | "bottom";
    align?: "center" | "left";
  },
) {
  useStyleSheet(stylesheet);

  return (
    <div className="truffle-tooltip-wrapper">
      {children}
      <div
        className={`truffle-tooltip ${
          classKebab({
            isTop: position === "top",
            isBottom: position === "bottom",
            isAlignLeft: align === "left",
            isAlignCenter: align === "center",
          })
        }`}
      >
        {tooltip}
      </div>
    </div>
  );
}
