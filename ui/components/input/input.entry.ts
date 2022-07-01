// FIXME: https://github.com/shoelace-style/shoelace/issues/705
// FIXME: also need npm.tfl.dev to not bundle everything together in single file (ie import the shared deps)
import SlInput from "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.77/dist/components/input/input.js";

class Input extends SlInput {}

export const name = "truffle.ui-input"; // should convert to truffle.ui.0.0.2.input on build

customElements.define(name, Input);

export default name;
