import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { gql, mutation } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

// HACK: we currently don't handle the case where the mutation observer element isn't found
// when we first make the call. for embeds of sourceType url there's a good chance
// we load our stuff before the actual dom is settled. so we wait a second before
// TODO: see if things are more stable with transframe
const LOAD_DELAY_MS = 1000; // 1 seconds

const DATAPOINT_INCREMENT_UNIQUE_MUTATION = gql`
mutation DatapointIncrementUnique ($input: DatapointIncrementUniqueInput!) {
  datapointIncrementUnique(input: $input) { isUpdated }
}`;

const PRIME_BUTTON_LAYOUT_CONFIG_STEPS = [
  {
    action: "querySelector",
    value: ".support-panel > div:last-child > div:last-child > div:last-child",
  },
];
const CSS_FOR_TWITCH = `
[data-test-selector="support-panel__benefits-wrapper"] {
  display: none;
}
[data-test-selector="support-panel__benefits-wrapper"] + div {
  display: none !important;
}
`;

// request needs to come from twitch frame, which is why this route exists
// (this route is embedded in twitch embed)
// only reason react is necessary here is so we can pass the sourceName
export default function PrimeSubListener() {
  useEffect(() => {
    setTimeout(() => {
      jumper.call("layout.applyLayoutConfigSteps", {
        layoutConfigSteps: [
          {
            action: "setStyleSheet",
            value: {
              id: "simpler-styles",
              css: CSS_FOR_TWITCH,
            },
          },
        ],
      });

      jumper.call("layout.listenForElements", {
        listenElementLayoutConfigSteps: [
          {
            action: "querySelector",
            // don't want to target body bc jumper has this propogate up to parent frame (yt)
            // when we want it to only go to twitch level
            // transframe approach should fix this
            value: '[data-a-page-loaded-name="SubsBroadcasterPage"]',
          },
        ],
        targetQuerySelector: ".tw-checkbox__label",
        observerConfig: { childList: true },
      }, (matches) => {
        const { id, innerText } = matches?.[0] || {};
        console.log("label", innerText); // keeping for prod debug, can rm mar 2023

        if (id && innerText?.toLowerCase().indexOf("prime") !== -1) {
          // send for our /youtube iframe to use the result
          jumper.call("comms.postMessage", {
            type: "twitch.canPrimeSubscribe",
            body: true,
          });
          // check the prime checkbox
          jumper.call("layout.click", {
            targetElementLayoutConfigSteps: [
              {
                action: "querySelector",
                value: `[data-truffle-id=${id}]`,
              },
            ],
          });

          mutation(DATAPOINT_INCREMENT_UNIQUE_MUTATION, {
            input: {
              metricSlug: "unique-prime-button-views",
            },
          });
        }
      });

      addPrimeButtonEventListener();
    }, LOAD_DELAY_MS);
  }, []);

  return <></>;
}

function addPrimeButtonEventListener() {
  // mutation observer in case element isn't ready immediately
  jumper.call("layout.listenForElements", {
    listenElementLayoutConfigSteps: PRIME_BUTTON_LAYOUT_CONFIG_STEPS,
    targetQuerySelector: "button:last-child",
    observerConfig: { childList: true },
  }, (matches) => {
    const isPrimeButton =
      matches?.[0]?.innerText?.toLowerCase().indexOf("prime") !== -1;
    if (isPrimeButton) {
      const id = matches?.[0]?.id;
      const onClick = () => {
        mutation(DATAPOINT_INCREMENT_UNIQUE_MUTATION, {
          input: {
            metricSlug: "unique-prime-button-subscriptions",
          },
        });
      };
      // when this button is clicked, record an event
      jumper.call("layout.addEventListener", {
        eventName: "click",
        targetElementLayoutConfigSteps: [
          {
            action: "querySelector",
            value: `[data-truffle-id=${id}]`,
          },
        ],
      }, onClick);
    }
  });
}
