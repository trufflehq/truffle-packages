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

    jumper.call("layout.listenForElements", {
      listenElementLayoutConfigSteps: PRIME_BUTTON_LAYOUT_CONFIG_STEPS,
      targetQuerySelector: "button:last-child",
    }, (matches) => {
      const isPrimeButton =
        matches?.[0]?.innerText?.toLowerCase().indexOf("prime") !== -1;
      if (isPrimeButton) {
        addPrimeButtonEventListener(matches?.[0]?.id);
      }
    });
  }, []);

  return <></>;
}

function addPrimeButtonEventListener(id: string) {
  jumper.call("layout.addEventListener", {
    eventName: "click",
    listenElementLayoutConfigSteps: [
      {
        action: "querySelector",
        value: `[data-truffle-id=${id}]`,
      },
    ],
  }, () => {
    mutation(DATAPOINT_INCREMENT_UNIQUE_MUTATION, {
      input: {
        metricSlug: "unique-prime-button-subscriptions",
      },
    });
  });
}
