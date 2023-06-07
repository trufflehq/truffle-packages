import { Icon, React, useStyleSheet } from "../../deps.ts";
import styleSheet from "./unlocked-icon.scss.js";

const GREEN = "#75DB9E";

export function UnlockedIcon() {
  useStyleSheet(styleSheet);
  return (
    <div className="c-unlocked-icon">
      <Icon icon="check" color={GREEN} size="14px" />
    </div>
  );
}
