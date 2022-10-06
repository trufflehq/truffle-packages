import { toDist, useStyleSheet } from "../deps.ts";
import styleSheet from "./layout.scss.js";

function Layout({ children }) {
  // initial theme styles
  useStyleSheet(styleSheet);
  return children;
}

export default toDist(Layout, import.meta.url);
