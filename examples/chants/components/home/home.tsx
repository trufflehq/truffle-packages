import React, { useEffect, useRef } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/react/index.ts";

import styleSheet from "./home.css.js";
import Chants from "../chants/chant.tsx";

function ExtensionMapping() {
  useStyleSheet(styleSheet);

  useEffect(() => {
    const style = {
      width: "104px",
      height: "36px",
      padding: "6px 0 2px 0",
      overflow: "hidden",
      // display: "block",
    };
    // set styles for this iframe within YouTube's site
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        { action: "setStyle", value: style },
      ],
    });
  }, []);
  return (
    <div className="c-home">
      <Chants />
    </div>
  );
}

export default ExtensionMapping;
