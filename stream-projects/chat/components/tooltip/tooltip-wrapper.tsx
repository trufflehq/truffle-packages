import { classKebab, React } from "../../deps.ts";

export type TooltipAlignment = "center" | "left";

export default function TooltipWrapper(
  { children, tooltip, position = "top", align = "center" }: {
    children: React.ReactNode;
    tooltip: React.ReactNode;
    position?: "top" | "bottom";
    align?: TooltipAlignment;
  },
) {
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
