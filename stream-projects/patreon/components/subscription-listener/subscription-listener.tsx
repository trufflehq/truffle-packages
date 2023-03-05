import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { gql, mutation } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";
import { getCookie } from "https://tfl.dev/@truffle/utils@~0.0.3/cookie/cookie.ts";
import { useSignal } from "https://tfl.dev/@truffle/state@~0.0.8/mod.ts";

const DATAPOINT_INCREMENT_UNIQUE_MUTATION = gql`
mutation DatapointIncrementUnique ($input: DatapointIncrementUniqueInput!) {
  datapointIncrementUnique(input: $input) { isUpdated }
}`;

const DATAPOINT_INCREMENT_METRIC_MUTATION = gql`
mutation DatapointIncrementMetric ($input: DatapointIncrementMetricInput!) {
  datapointIncrementMetric(input: $input) { isUpdated }
}`;

// only reason react is necessary here is so we can pass the patreonUsername
export default function SubscriptionListener({ patreonUsername }) {
  const dollarAmount$ = useSignal(5);

  const onClick = () => {
    mutation(DATAPOINT_INCREMENT_UNIQUE_MUTATION, {
      input: {
        metricSlug: "unique-patreon-subscriptions",
      },
    });

    mutation(DATAPOINT_INCREMENT_METRIC_MUTATION, {
      input: {
        metricSlug: "revenue-added-cents",
        count: dollarAmount$.get() * 100,
      },
    });
  };

  useEffect(() => {
    const wasFromTruffle = getCookie("patreon-click");

    if (!wasFromTruffle) {
      return;
    }

    setDollarAmount$(dollarAmount$);
    addClickListener(onClick);
  }, []);

  return <></>;
}

function setDollarAmount$(dollarAmount$) {
  jumper.call("layout.listenForElements", {
    listenElementLayoutConfigSteps: [
      {
        action: "querySelector",
        value: "body",
      },
    ],
    targetQuerySelector: "input[name=cadence]",
    observerConfig: { childList: true },
  }, (matches) => {
    const value = matches?.[0]?.attributes?.value;
    const dollarAmount = value?.match(/\$([\d.]+)/)?.[1];
    dollarAmount$.set(dollarAmount);
  });
}

function addClickListener(onClick) {
  jumper.call("layout.listenForElements", {
    listenElementLayoutConfigSteps: [
      {
        action: "querySelector",
        value: "body",
      },
    ],
    targetQuerySelector: "#renderPageContentWrapper button:last-child",
    observerConfig: { childList: true },
  }, (matches) => {
    const id = matches?.[0]?.id;
    if (id) {
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
