import { signal } from "https://tfl.dev/@truffle/state@~0.0.12/signals/signal.ts";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";

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
  }
});
