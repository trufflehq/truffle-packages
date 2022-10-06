import { jumper } from "../../../deps.ts";

const RAID_IRFRAME_HIDDEN_STYLES = {
  display: "none",
};

const RAID_IFRAME_SHOWING_STYLES = {
  width: "100vw",
  height: "100vh",
  position: "fixed",
  "z-index": 999,
};

export function setShowingStyles() {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      { action: "useSubject" }, // start with our iframe
      { action: "setStyle", value: RAID_IFRAME_SHOWING_STYLES },
    ],
  });
}

export function setHiddenStyles() {
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      { action: "useSubject" }, // start with our iframe
      { action: "setStyle", value: RAID_IRFRAME_HIDDEN_STYLES },
    ],
  });
}
