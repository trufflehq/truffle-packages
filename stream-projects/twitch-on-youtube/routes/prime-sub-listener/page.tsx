import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import PrimeSubListener from "../../components/prime-sub-listener/prime-sub-listener.tsx";

function PrimeSubListenerPage() {
  return <PrimeSubListener channelName="stanz" />;
}

export default toDist(PrimeSubListenerPage, import.meta.url);
