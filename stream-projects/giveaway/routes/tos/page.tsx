import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import Tos from "../../components/tos/tos.tsx";

function TosPage() {
  return (
    <Tos />
  );
}

export default toDist(TosPage, import.meta.url);
