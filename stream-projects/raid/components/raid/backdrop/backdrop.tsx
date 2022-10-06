import { React, useStyleSheet } from "../../../deps.ts";
import styleSheet from "./backdrop.scss.js";
import { hideRaid } from "../util/manager.ts";

export default function RaidBackdrop({ children }: { children?: any }) {
  useStyleSheet(styleSheet);
  return (
    <div
      className="c-raid-backdrop"
      onClick={(e) => {
        if (e.target == e.currentTarget) hideRaid();
      }}
    >
      {children}
    </div>
  );
}
