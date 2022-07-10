// If you have problems with this and SSR, switch to skypack
import {
  Button as FoundationButton,
  buttonTemplate,
} from "https://npm.tfl.dev/@microsoft/fast-foundation@alpha";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import { css, html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import { toDist } from "https://tfl.dev/@truffle/distribute@1.0.0/format/wc/index.js";

import Stylesheet from "../stylesheet/stylesheet.ts";

class Button extends FoundationButton {}

const stylesUrl = new URL("./button.css", import.meta.url).toString();
const template = html`
  <${Stylesheet} :url="${stylesUrl}"></${Stylesheet}>
  ${buttonTemplate}`;

const buttonDefinition = Button.compose({
  template,
  styles: () => css``, // we set styles in template so they can change depending on theme
});

export default toDist(
  "fast-foundation",
  buttonDefinition,
  import.meta.url,
  {
    appearance: PropTypes.oneOf(["primary", "surface"]),
  },
);
