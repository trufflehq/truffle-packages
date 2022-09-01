// If you have problems with this and SSR, switch to skypack
import {
  Button as FoundationButton,
  buttonTemplate,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@3.0.0-alpha.4";
import {
  css,
  html,
} from "https://npm.tfl.dev/@microsoft/fast-element@2.0.0-beta.3";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.4/format/wc/fast-foundation/index.ts";

import Stylesheet from "../stylesheet/stylesheet.tag.ts";

class Button extends FoundationButton {}

// styles set in <Stylesheet> instead of template so they can change depending on theme
const stylesUrl = new URL("./button.css", import.meta.url).toString();
const template = html`
  <${Stylesheet} :url="${stylesUrl}"></${Stylesheet}>
  ${buttonTemplate}`;

const buttonDefinition = Button.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

export default toDist(buttonDefinition, import.meta.url);
