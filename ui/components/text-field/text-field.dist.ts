// If you have problems with this and SSR, switch to skypack
import {
  TextField as FoundationTextField,
  textFieldTemplate,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@alpha";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import { toDist } from "https://tfl.dev/@truffle/distribute@^1.0.0/format/wc/index.ts";

import Stylesheet from "../stylesheet/stylesheet.tag.ts";

class TextField extends FoundationTextField {}

const stylesUrl = new URL("./text-field.css", import.meta.url).toString();
const template = html`
  <${Stylesheet} :url="${stylesUrl}"></${Stylesheet}>
  ${textFieldTemplate}`;

const textFieldDefinition = TextField.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

export default toDist(
  "fast-foundation",
  textFieldDefinition,
  import.meta.url,
);
