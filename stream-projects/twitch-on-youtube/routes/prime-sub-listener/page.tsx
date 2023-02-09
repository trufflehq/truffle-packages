import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import PrimeButtonTwitch from "../../components/prime-sub-listener/prime-sub-listener.tsx";

function PrimeButtonTwitchPage() {
  return <PrimeButtonTwitch channelName="stanz" />;
}

export default toDist(PrimeButtonTwitchPage, import.meta.url);
