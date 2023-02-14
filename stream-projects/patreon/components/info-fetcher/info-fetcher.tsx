import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";

const TIER_NAME_LAYOUT_CONFIG_STEPS = [
  {
    action: "querySelector",
    value: "body",
  },
];

// only reason react is necessary here is so we can pass the patreonUsername
export default function InfoFetcher({ patreonUsername }) {
  useEffect(() => {
    jumper.call("layout.listenForElements", {
      listenElementLayoutConfigSteps: TIER_NAME_LAYOUT_CONFIG_STEPS,
      targetQuerySelector: "[data-tag=patron-tier-section] h3",
    }, (matches) => {
      const tierName = matches?.[0]?.innerText;
      jumper.call("comms.postMessage", {
        type: "patreon.tierName",
        body: tierName || "",
      });
    });
  }, []);

  return <></>;
}
