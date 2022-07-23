// If you have problems with this and SSR, switch to skypack
import {
  TextArea as FoundationTextArea,
  textAreaTemplate,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@3.0.0-alpha.4";
import {
  css,
  html,
} from "https://npm.tfl.dev/@microsoft/fast-element@2.0.0-beta.3";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/fast-foundation/index.ts";

import Stylesheet from "../stylesheet/stylesheet.tag.ts";

class TextArea extends FoundationTextArea {}

// styles set in <Stylesheet> instead of template so they can change depending on theme
const stylesUrl = new URL("./text-area.css", import.meta.url).toString();
const template = html`
  <${Stylesheet} :url="${stylesUrl}"></${Stylesheet}>
  ${textAreaTemplate}`;

const textAreaDefinition = TextArea.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

export default toDist(textAreaDefinition, import.meta.url);
