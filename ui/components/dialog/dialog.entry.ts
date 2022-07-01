// FIXME: https://github.com/shoelace-style/shoelace/issues/705
// FIXME: also need npm.tfl.dev to not bundle everything together in single file (ie import the shared deps)
import SlDialog from "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.77/dist/components/dialog/dialog.js";

class Dialog extends SlDialog {}

export const name = "truffle.ui-dialog"; // should convert to truffle.ui.0.0.2.dialog on build

customElements.define(name, Dialog);

export default name;
