import React from "https://npm.tfl.dev/react";
import { useParams } from "https://tfl.dev/@truffle/utils@0.0.1/router/router.js";

export default function MyVarPage() {
  const params = useParams();

  return (
    <div>
      Page with variable route: {JSON.stringify(params)}
    </div>
  );
}
