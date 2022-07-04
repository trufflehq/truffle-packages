import {
  DesignSystem,
  Dialog as FoundationDialog,
  dialogTemplate,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@2";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@1";

import Stylesheet from "../stylesheet/stylesheet.jsx";

class Dialog extends FoundationDialog {}

const stylesUrl = new URL("./dialog.css", import.meta.url);
const template = html`
  <${Stylesheet} url="${stylesUrl}"></${Stylesheet}>
  ${dialogTemplate}`;

const dialogDefinition = Dialog.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

const elementName = "truffle.ui-dialog";
const [prefix, ...rest] = elementName.split("-");
const baseName = rest.join("-");

DesignSystem.getOrCreate().register(dialogDefinition({ prefix, baseName }));

export default elementName;
