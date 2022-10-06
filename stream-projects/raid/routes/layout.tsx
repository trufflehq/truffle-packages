import { toDist, useStyleSheet } from "../deps.ts";
import { useGoogleFontLoader } from "../shared/util/hooks.ts";

import styleSheet from "./layout.scss.js";

function Layout({ children }) {
  // initial theme styles
  const fonts = ["Poppins"];
  useGoogleFontLoader(() => fonts, fonts);
  useStyleSheet(styleSheet);
  return children;
}

export default toDist(Layout, import.meta.url);
