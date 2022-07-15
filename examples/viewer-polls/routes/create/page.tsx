import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^1.0.0/format/wc/index.ts";

import Create from "../../components/create/create.tsx";

function CreatePage() {
  return <Create />;
}

export default toDist("react", CreatePage, import.meta.url);
