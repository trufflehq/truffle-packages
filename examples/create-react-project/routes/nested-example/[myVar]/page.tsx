import React from "https://npm.tfl.dev/react";
import { useParams } from "https://tfl.dev/@truffle/utils@0.0.1/router/router.js";
import { toWebComponent } from "https://tfl.dev/@truffle/web-component@1.0.0/index.js";

function MyVarPage() {
  const params = useParams();

  return (
    <div>
      Page with variable route: {JSON.stringify(params)}
    </div>
  );
}

export default toWebComponent('react', MyVarPage, import.meta.url)