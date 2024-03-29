import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import Chants from "../chants/chant.tsx";

import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import styleSheet from "./chants-embed.scss.js";

export default function ChantsEmbed({
  showPillCount,
  showBgCount,
}: { showPillCount?: number; showBgCount?: number }) {
  useStyleSheet(styleSheet);
  useEffect(() => {
    const style = {
      width: "104px",
      height: "36px",
      padding: "6px 0 2px 0",
      overflow: "hidden",
      position: "relative",
      'z-index': "1"
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
    <div className="c-chants-embed">
      <Chants showPillCount={showPillCount} showBgCount={showBgCount} />
    </div>
  );
}
