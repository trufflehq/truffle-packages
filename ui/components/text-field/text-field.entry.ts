import {
  DesignSystem,
  TextField as FoundationTextField,
  textFieldTemplate,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@2";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@1";

class TextField extends FoundationTextField {}

const template = html`
  <link rel="stylesheet" href="${new URL(
  "./text-field.css",
  import.meta.url,
)}" />
  ${textFieldTemplate}`;

const textFieldDefinition = TextField.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

const elementName = "truffle.ui-text-field";
const [prefix, baseName] = elementName.split("-");

DesignSystem.getOrCreate().register(textFieldDefinition({ prefix, baseName }));

export default elementName;
