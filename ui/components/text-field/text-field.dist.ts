// If you have problems with this and SSR, switch to skypack
import {
  TextField as FoundationTextField,
  textFieldTemplate,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@3.0.0-alpha.4";
import {
  css,
  html,
} from "https://npm.tfl.dev/@microsoft/fast-element@2.0.0-beta.3";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/fast-foundation/index.ts";

import Stylesheet from "../stylesheet/stylesheet.tag.ts";

class TextField extends FoundationTextField {}

// styles set in <Stylesheet> instead of template so they can change depending on theme
const stylesUrl = new URL("./text-field.css", import.meta.url).toString();
const template = html`
  <${Stylesheet} :url="${stylesUrl}"></${Stylesheet}>
  ${textFieldTemplate}`;

const textFieldDefinition = TextField.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

export default toDist(textFieldDefinition, import.meta.url);
