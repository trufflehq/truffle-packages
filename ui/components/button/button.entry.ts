// FIXME: https://github.com/shoelace-style/shoelace/issues/705
// FIXME: also need npm.tfl.dev to not bundle everything together in single file (ie import the shared deps)
import SlButton from "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.77/dist/components/button/button.js";

class Button extends SlButton {}

export const name = "truffle.ui-button"; // should convert to truffle.ui.0.0.2.button on build

customElements.define(name, Button);

export default name;
