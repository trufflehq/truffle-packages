// If you have problems with this and SSR, switch to skypack
import {
  Dialog as FoundationDialog,
  dialogTemplate,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@alpha";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import { toDist } from "https://tfl.dev/@truffle/distribute@1.0.0/format/wc/index.ts";

import Stylesheet from "../stylesheet/stylesheet.tag.ts";

class Dialog extends FoundationDialog {}

const stylesUrl = new URL("./dialog.css", import.meta.url).toString();
const template = html`
  <${Stylesheet} :url="${stylesUrl}" initial-state="display-none"></${Stylesheet}>
  ${dialogTemplate}`;

const dialogDefinition = Dialog.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

export default toDist(
  "fast-foundation",
  dialogDefinition,
  import.meta.url,
);
