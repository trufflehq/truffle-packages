import {
  DesignSystem,
  Dialog as FoundationDialog,
  dialogTemplate,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@2";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@1";

class Dialog extends FoundationDialog {}

const template = html`
  <link rel="stylesheet" href="${new URL("./dialog.css", import.meta.url)}" />
  ${dialogTemplate}`;

const dialogDefinition = Dialog.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

const elementName = "truffle.ui-dialog";
const [prefix, baseName] = elementName.split("-");

DesignSystem.getOrCreate().register(dialogDefinition({ prefix, baseName }));

export default elementName;
