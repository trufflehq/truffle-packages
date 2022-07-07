import React from "https://npm.tfl.dev/react";
import { useParams } from "https://tfl.dev/@truffle/utils@0.0.1/router/router.js";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";
// FIXME: import from our router
// TODO: <Link> component
import history from "https://npm.tfl.dev/history@5/browser";

function MyVarPage() {
  const params = useParams();

  const go = (e) => {
    e.preventDefault()
    history.push("/nested-example/child-page")
  }

  return (
    <div>
      Page with variable route: {JSON.stringify(params)}
      <a href="/nested-example" onClick={go}>Go</a>
    </div>
  );
}

export default toWebComponent(MyVarPage)