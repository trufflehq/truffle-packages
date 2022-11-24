import { jumper, useEffect } from '../../deps.ts'


export function setChatFrameStyles () {
  const styles = {
    width: "100%",
    height: "100%",
    background: "transparent",
    "z-index": 2000,
    overflow: "hidden",
    "margin-top": "4px",
    transition: "clip-path .25s cubic-bezier(.4,.71,.18,.99)",
  };
  jumper.call("layout.applyLayoutConfigSteps", {
    layoutConfigSteps: [
      { action: "useSubject" }, // start with our iframe
      { action: "setStyle", value: styles },
    ],
  });
}

export function useSetChatFrameStyles() {
  useEffect(() => {
    setChatFrameStyles();
  }, []);
}
