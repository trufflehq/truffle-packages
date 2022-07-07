import React from "https://npm.tfl.dev/react";
import { useParams } from "https://tfl.dev/@truffle/utils@0.0.1/router/router.js";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

function MyVarPage() {
  const params = useParams();

  return (
    <div>
      Page with variable route: {JSON.stringify(params)}
    </div>
  );
}

export default toWebComponent(MyVarPage)