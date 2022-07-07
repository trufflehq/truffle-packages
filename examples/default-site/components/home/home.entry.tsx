import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@0.0.1/jumper/jumper.js";
import Stylesheet from "https://tfl.dev/@truffle/ui@0.0.2/components/stylesheet/stylesheet.js";
import Button from "https://tfl.dev/@truffle/ui@0.0.2/components/button/button.entry.js";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";
// FIXME: import from our router
import history from "https://npm.tfl.dev/history@5/browser";

import Counter from "../counter/counter.tsx";
import UserInfo from "../user-info/user-info.tsx";

console.log('home called');


function ExtensionMapping() {
  console.log('render1');
  
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

  const go = (e) => {
    e.preventDefault()
    history.push("/nested-example/child-page")
  }

  return (
    <>
      <Stylesheet url={new URL("./home.css", import.meta.url)} />
      Hello world!
      <Counter initialCount={2} />
      <UserInfo />
      <a href="/nested-example/child-page" onClick={go}>Go</a>
    </>
  );
}

export default toWebComponent(ExtensionMapping)