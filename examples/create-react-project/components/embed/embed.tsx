import React, { useEffect, useState } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import Button from "https://tfl.dev/@truffle/ui@~0.1.0/components/button/button.tag.ts";

const IFRAME_VISIBLE_STYLE = {
  width: "400px",
  height: "400px",
  background: "#fff",
  position: "fixed",
  display: "block",
  bottom: 0,
  "z-index": "999",
};
const IFRAME_HIDDEN_STYLE = { display: "none" };
const INITIAL_DELAY_MS = 3000; // show after 3s

function Embed() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log(`Iframe visibility: ${isVisible}`);

    const style = isVisible ? IFRAME_VISIBLE_STYLE : IFRAME_HIDDEN_STYLE;
    // set styles for this iframe within YouTube's site
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        { action: "setStyle", value: style },
      ],
    });

    if (!isVisible) {
      setTimeout(() => {
        setIsVisible(true);
      }, INITIAL_DELAY_MS);
    }
  }, [isVisible]);

  return (
    <div className="c-hidden-extension-mapping">
      <Button onclick={() => setIsVisible(false)}>
        Hide me for {INITIAL_DELAY_MS}ms!
      </Button>
    </div>
  );
}

export default Embed;
