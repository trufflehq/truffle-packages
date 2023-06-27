import { Icon, React, useStyleSheet } from "../../deps.ts";
import styleSheet from "./locked-icon.scss.js";

const YELLOW = "#EBC564";

export function LockedIcon() {
  useStyleSheet(styleSheet);
  return (
    <div className="c-locked-icon">
      <Icon icon="lock" color={YELLOW} size="14px" />
    </div>
  );
}
