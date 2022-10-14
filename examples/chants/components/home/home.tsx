import React from "https://npm.tfl.dev/react";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/react/index.ts";

import styleSheet from "./home.css.js";
import ChantsEmbed from "../chants-embed/chants-embed.tsx";

function ExtensionMapping() {
  useStyleSheet(styleSheet);

  return <ChantsEmbed showPillCount={2} showBgCount={3} />;
}

export default ExtensionMapping;
