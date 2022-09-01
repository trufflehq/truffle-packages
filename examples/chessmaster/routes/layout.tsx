import {
  toDist,
  useStyleSheet,
} from "https://tfl.dev/@truffle/distribute@^2.0.4/format/wc/react/index.ts";
import React from "https://npm.tfl.dev/react";

import styleSheet from "./layout.css.js";
import UserInfo from "../components/user-info/user-info.tsx";

function Layout({ children }) {
  // initial theme styles
  useStyleSheet(styleSheet);
  return (
    <div className="layout">
      <UserInfo />
      <div className="container">
        {children}
      </div>
    </div>
  );
}

export default toDist(Layout, import.meta.url);
