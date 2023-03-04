import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.3/jumper/jumper.ts";
import { gql, mutation } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";
import { getCookie } from "https://tfl.dev/@truffle/utils@~0.0.3/cookie/cookie.ts";

const DATAPOINT_INCREMENT_UNIQUE_MUTATION = gql`
mutation DatapointIncrementUnique ($input: DatapointIncrementUniqueInput!) {
  datapointIncrementUnique(input: $input) { isUpdated }
}`;

// only reason react is necessary here is so we can pass the patreonUsername
export default function SubscriptionListener({ patreonUsername }) {
  useEffect(() => {
    const wasFromTruffle = getCookie("patreon-click");

    if (!wasFromTruffle) {
      return;
    }

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
        const onClick = () => {
          mutation(DATAPOINT_INCREMENT_UNIQUE_MUTATION, {
            input: {
              metricSlug: "unique-patreon-subscriptions",
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
  }, []);

  return <></>;
}
