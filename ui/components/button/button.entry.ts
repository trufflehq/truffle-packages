// SSR breaks on npm.tfl version atm
import {
  Button as FoundationButton,
  buttonTemplate,
  DesignSystem,
} from "https://cdn.skypack.dev/@microsoft/fast-foundation@alpha";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";

import Stylesheet from "../stylesheet/stylesheet.jsx";

class Button extends FoundationButton {}

const stylesUrl = new URL("./button.css", import.meta.url).toString();
const template = html`
  <${Stylesheet} :url="${stylesUrl}"></${Stylesheet}>
  ${buttonTemplate}`;

const buttonDefinition = Button.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

const elementName = "truffle.ui-button";
const [prefix, ...rest] = elementName.split("-");
const baseName = rest.join("-");

DesignSystem.getOrCreate().register(buttonDefinition({ prefix, baseName }));

export default elementName;
