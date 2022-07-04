import {
  Button as FoundationButton,
  buttonTemplate,
  DesignSystem,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@2";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@1";

class Button extends FoundationButton {}

const template = html`
  <link rel="stylesheet" href="${new URL("./button.css", import.meta.url)}" />
  ${buttonTemplate}`;

const buttonDefinition = Button.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

const elementName = "truffle.ui-button";
const [prefix, baseName] = elementName.split("-");

DesignSystem.getOrCreate().register(buttonDefinition({ prefix, baseName }));

export default elementName;
