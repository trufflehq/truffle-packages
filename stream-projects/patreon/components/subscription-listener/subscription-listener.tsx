import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { gql, mutation } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

const DATAPOINT_INCREMENT_UNIQUE_MUTATION = gql`
mutation DatapointIncrementUnique ($input: DatapointIncrementUniqueInput!) {
  datapointIncrementUnique(input: $input) { isUpdated }
}`;

const TIER_NAME_LAYOUT_CONFIG_STEPS = [
  {
    action: "querySelector",
    value: "body",
  },
];

// only reason react is necessary here is so we can pass the patreonUsername
export default function SubscriptionListener({ patreonUsername }) {
  useEffect(() => {
    // mutation(DATAPOINT_INCREMENT_UNIQUE_MUTATION, {
    //   input: {
    //     metricSlug: "unique-patreon-views",
    //   },
    // });

    // TODO: get payment button and add event listener
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
