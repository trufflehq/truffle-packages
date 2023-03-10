import { signal } from "https://tfl.dev/@truffle/state@~0.0.12/signals/signal.ts";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";
import { gql, mutation } from "https://tfl.dev/@truffle/api@~0.2.0/client.ts";

const DATAPOINT_INCREMENT_UNIQUE_MUTATION = gql`
mutation DatapointIncrementUnique ($input: DatapointIncrementUniqueInput!) {
  datapointIncrementUnique(input: $input) { isUpdated }
}`;

export const tierName$ = signal("");

// faster than waiting for patreon to load
jumper.call("storage.get", { key: "patreon.tierName" }).then((tierName) => {
  tierName$.set(tierName);
});

jumper.call("comms.onMessage", (message) => {
  if (message?.type === "patreon.tierName") {
    tierName$.set(message.body);
    // store for future loads to be faster than waiting for patreon to load
    jumper.call("storage.set", {
      key: "patreon.tierName",
      value: message.body,
    });

    mutation(DATAPOINT_INCREMENT_UNIQUE_MUTATION, {
      input: {
        metricSlug: "unique-patreon-premium-content-embed-views",
        dimensionValues: {
          "patreon-tier-name": message.body || "none",
        },
      },
    });
  }
});
