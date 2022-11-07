import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import MashControls from "../mash-controls/mash-controls.tsx";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import styleSheet from "./mash.scss.js";
function ExtensionMapping() {
  useEffect(() => {
    const style = {
      width: "400px",
      height: "400px",
      background: "#fff",
      position: "fixed",
      bottom: 0,
      "z-index": "999",
    };
    // set styles for this iframe within YouTube's site
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        { action: "setStyle", value: style },
      ],
    });
  }, []);
  useStyleSheet(styleSheet);

  return (
    <>
      <MashControls />
    </>
  );
}

export default ExtensionMapping;
