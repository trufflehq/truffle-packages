import {
  Button as FoundationButton,
  buttonTemplate,
  DesignSystem,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@2";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@1";

import Stylesheet from "../stylesheet/stylesheet.jsx";

class Button extends FoundationButton {}

const stylesUrl = new URL("./button.css", import.meta.url);
const template = html`
  <${Stylesheet} url="${stylesUrl}"></${Stylesheet}>
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
