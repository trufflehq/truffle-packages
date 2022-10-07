import { jumper } from "../../../deps.ts";

const RAID_IRFRAME_HIDDEN_STYLES = {
  display: "none",
};

const RAID_IFRAME_SHOWING_STYLES = {
  width: "100%",
  height: "100%",
  position: "absolute",
  display: "block",
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
