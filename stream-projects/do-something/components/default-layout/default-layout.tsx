import { useGoogleFontLoader, useStyleSheet } from "../../deps.ts";

import styleSheet from "./default-layout.scss.js";

export default function DefaultLayout({ children }) {
  // initial theme styles
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Inter"]);
  return children;
}
