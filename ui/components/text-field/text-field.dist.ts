// SSR breaks on npm.tfl version atm
import {
  TextField as FoundationTextField,
  textFieldTemplate,
} from "https://cdn.skypack.dev/@microsoft/fast-foundation@alpha";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import { toWebComponent } from "https://tfl.dev/@truffle/web-component@1.0.0/index.js";

import Stylesheet from "../stylesheet/stylesheet.ts";

class TextField extends FoundationTextField {}

const stylesUrl = new URL("./text-field.css", import.meta.url).toString();
const template = html`
  <${Stylesheet} :url="${stylesUrl}"></${Stylesheet}>
  ${textFieldTemplate}`;

const textFieldDefinition = TextField.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

export default toWebComponent(
  "fast-foundation",
  textFieldDefinition,
  import.meta.url,
);
