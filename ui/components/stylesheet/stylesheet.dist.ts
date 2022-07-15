import {
  FASTElement,
  html,
  observable,
} from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/fast/index.ts";

// initial-state is a property only we should be using atm
// eventually we could document, but need to see how we like it first.
// unsure on the current naming.
// use if display-none for elements that will be position: fixed
// alternative would be to add  <style></style> to the relevant component (eg dialog)
const template = html`
  <style>
    :host {
      ${(x) => {
  if (x.attributes["initial-state"]?.value === "display-none") {
    return x.isLoaded ? "display: inherit" : "display: none";
  } else {
    return x.isLoaded ? "opacity: inherit" : "opacity: 0";
  }
}}
    }
  </style>
  <link
    @load=${(x) => x.isLoaded = true}
    rel="stylesheet"
    href="${(x) => (x.url || x.attributes.url.value).toString()}"
  />`;

class Stylesheet extends FASTElement {
  @observable
  isLoaded: boolean = false;
}

export default toDist(
  {
    decoratorObj: {
      template,
      shadowOptions: null, // light-dom
    },
    Class: Stylesheet,
  },
  import.meta.url,
);
