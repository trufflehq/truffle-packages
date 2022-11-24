import { React, useSelector, useStyleSheet } from "../../../deps.ts";
import styleSheet from "./backdrop.scss.js";
import { hideRaid } from "../util/manager.ts";
import { raidState$ } from "../util/state.ts";

export default function RaidBackdrop({ children }: { children?: any }) {
  useStyleSheet(styleSheet);
  const raidId = useSelector(() => raidState$.id.get());
  return (
    <div
      className="c-raid-backdrop"
      onClick={(e) => {
        if (e.target == e.currentTarget) hideRaid(raidId);
      }}
    >
      {children}
    </div>
  );
}
