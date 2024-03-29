import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import Create from "../../components/create/create.tsx";

function CreatePage() {
  return <Create />;
}

export default toDist(CreatePage, import.meta.url);
