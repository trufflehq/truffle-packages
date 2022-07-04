import {
  DesignSystem,
  TextField as FoundationTextField,
  textFieldTemplate,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@2";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@1";

import Stylesheet from "../stylesheet/stylesheet.jsx";

class TextField extends FoundationTextField {}

const stylesUrl = new URL("./text-field.css", import.meta.url);
const template = html`
  <${Stylesheet} url="${stylesUrl}"></${Stylesheet}>
  ${textFieldTemplate}`;

const textFieldDefinition = TextField.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

const elementName = "truffle.ui-text-field";
const [prefix, ...rest] = elementName.split("-");
const baseName = rest.join("-");

DesignSystem.getOrCreate().register(textFieldDefinition({ prefix, baseName }));

export default elementName;
