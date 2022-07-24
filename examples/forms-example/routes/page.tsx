import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts";

import Form from "../components/form/form.tsx";
import { Link, useStyleSheet } from "../deps.ts";

import styleSheet from "./page.css.ts";

function HomePage() {
  useStyleSheet(styleSheet);
  return (
    <div className="p-index-page">
      <div className="nav">
        <Link href="/admin">Admin</Link>
      </div>
      <Form />
    </div>
  );
}

export default toDist(HomePage, import.meta.url);
