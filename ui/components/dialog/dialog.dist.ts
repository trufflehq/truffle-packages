// SSR breaks on npm.tfl version atm
import {
  Dialog as FoundationDialog,
  dialogTemplate,
} from "https://cdn.skypack.dev/@microsoft/fast-foundation@alpha";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import { toWebComponent } from "https://tfl.dev/@truffle/web-component@1.0.0/index.js";

import Stylesheet from "../stylesheet/stylesheet.ts";

class Dialog extends FoundationDialog {}

const stylesUrl = new URL("./dialog.css", import.meta.url).toString();
const template = html`
  <${Stylesheet} :url="${stylesUrl}"></${Stylesheet}>
  ${dialogTemplate}`;

const dialogDefinition = Dialog.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

export default toWebComponent(
  "fast-foundation",
  dialogDefinition,
  import.meta.url,
);
