import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { gql, mutation } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

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
export default function PrimeSubListener({ channelName }) {
  useEffect(() => {
    mutation(DATAPOINT_INCREMENT_UNIQUE_MUTATION, {
      input: {
        metricSlug: "unique-prime-button-views",
      },
    });

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
          value: "body",
        },
      ],
      targetQuerySelector: ".tw-checkbox__input",
    }, (matches) => {
      const id = matches?.[0]?.id;
      if (id) {
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
      }
    });

    addPrimeButtonEventListener();
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
