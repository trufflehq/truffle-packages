import React from "https://npm.tfl.dev/react";
import {
  toDist,
  useStyleSheet,
} from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";
import Link from "https://tfl.dev/@truffle/router@^1.0.0/components/link/link.tag.ts";

import examples from "../../components/graphql/examples.ts";
import styleSheet from "./layout.scss.js";

function Layout({ children }) {
  useStyleSheet(styleSheet);

  return (
    <div className="p-graphql-layout">
      <h3>Examples</h3>
      <div className="links">
        {Object.entries(examples).map(([key, example]) => (
          <Link className="link" href={`/graphql/${key}`}>{key}</Link>
        ))}
      </div>
      <div className="example">
        {children}
      </div>
    </div>
  );
}

export default toDist(Layout, import.meta.url);
