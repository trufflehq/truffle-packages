// HACK: don't use this. we use for mogul-menu alpha
// can remove whenever we do oauth flow

// If you have problems with this and SSR, switch to skypack
import {
  Dialog as FoundationDialog,
  dialogTemplate,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@3.0.0-alpha.4";
import {
  css,
  html,
} from "https://npm.tfl.dev/@microsoft/fast-element@2.0.0-beta.3";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/fast-foundation/index.ts";

import Stylesheet from "../stylesheet/stylesheet.tag.ts";

// THIS IS A HACK FOR MOGUL MENU DON'T USE THIS PLZ & TY
class AbsoluteDialog extends FoundationDialog {}

// styles set in <Stylesheet> instead of template so they can change depending on theme
const stylesUrl = new URL("./absolute-dialog.css", import.meta.url).toString();
const template = html`
  <${Stylesheet} :url="${stylesUrl}" initial-state="display-none"></${Stylesheet}>
  ${dialogTemplate}`;

const absoluteDialogDefinition = AbsoluteDialog.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

export default toDist(absoluteDialogDefinition, import.meta.url);
