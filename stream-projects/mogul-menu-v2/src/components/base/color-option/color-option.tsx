import { React, useStyleSheet } from "../../../deps.ts";
import Option from "../option/option.tsx";
import styleSheet from "./color-option.scss.js";

export default function ColorOption({
  children,
  value,
  disabled,
  color,
  defaultOption,
}: {
  children?: any;
  value?: string;
  disabled?: boolean;
  color?: string;
  defaultOption?: boolean;
}) {
  useStyleSheet(styleSheet);
  return (
    <Option disabled={disabled} value={value} defaultOption={defaultOption}>
      <div className="c-color-option">
        <div
          className="preview"
          style={{ "--background": color ? "darkgray" : "transparent" }}
        >
          <div className="fill" style={{ "--color": color }} />
        </div>
        <div className="text">{children}</div>
      </div>
    </Option>
  );
}
