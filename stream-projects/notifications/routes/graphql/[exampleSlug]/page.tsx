import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/react/index.ts";

import Graphql from "../../../components/graphql/graphql.tsx";

function GraphqlPage() {
  return <Graphql />;
}

export default toDist(GraphqlPage, import.meta.url);
