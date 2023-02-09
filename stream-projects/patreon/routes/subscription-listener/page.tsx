import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import SubscriptionListener from "../../components/subscription-listener/subscription-listener.tsx";

function SubscriptionListenerPage() {
  return <SubscriptionListener patreonUsername="theyard" />;
}

export default toDist(SubscriptionListenerPage, import.meta.url);
