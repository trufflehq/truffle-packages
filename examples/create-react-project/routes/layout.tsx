import React from "https://npm.tfl.dev/react";
import {
  toDist,
  useStyleSheet,
} from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import Link from "https://tfl.dev/@truffle/router@^1.0.0/components/link/link.tag.ts";

import styleSheet from "./layout.css.js";

function Layout({ children }) {
  // initial theme styles
  useStyleSheet(styleSheet);
  return (
    <div className="p-layout">
      <div className="links">
        <Link className="link" href={`/`}>Home</Link>
        <Link className="link" href={`/graphql/me`}>GraphQL examples</Link>
        <Link className="link" href={`/embed`}>Embed example</Link>
      </div>
      {children}
    </div>
  );
}

export default toDist(Layout, import.meta.url);
