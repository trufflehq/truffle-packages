import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import Submission from "../submission/submission.tsx";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.19/format/wc/react/index.ts";
import styleSheet from "./submission-mapping.scss.js";
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
      <Submission onCancel={() => console.log("oncancel")} />
    </>
  );
}

export default ExtensionMapping;
