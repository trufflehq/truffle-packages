import { toDist, useStyleSheet } from "../deps.ts";
import { useGoogleFontLoader } from "../shared/hooks/use-google-font.ts";

import styleSheet from "./layout.css.js";

function Layout({ children }) {
  // initial theme styles
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Inter"]);
  return children;
}

export default toDist(Layout, import.meta.url);
