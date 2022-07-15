import React, { useEffect, useRef } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";
import Link from "https://tfl.dev/@truffle/router@^1.0.0/components/link/link.tag.ts";

import Counter from "../counter/counter.tsx";
import UserInfo from "../user-info/user-info.tsx";
import styleSheet from "./home.css.js";

function ExtensionMapping() {
  useStyleSheet(styleSheet);

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

  return (
    <>
      Hello world!
      <Counter initialCount={2} />
      <UserInfo />
      <Link href="/abc">My link</Link>
    </>
  );
}

export default ExtensionMapping;
