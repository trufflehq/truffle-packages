// SSR breaks on npm.tfl version atm
import {
  DesignSystem,
  TextField as FoundationTextField,
  textFieldTemplate,
} from "https://cdn.skypack.dev/@microsoft/fast-foundation@alpha";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";

import Stylesheet from "../stylesheet/stylesheet.ts";

class TextField extends FoundationTextField {}

const stylesUrl = new URL("./text-field.css", import.meta.url);
const template = html`
  <${Stylesheet} :url="${stylesUrl}"></${Stylesheet}>
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
