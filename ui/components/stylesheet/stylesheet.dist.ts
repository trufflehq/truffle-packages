import {
  FASTElement,
  html,
  observable,
} from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import { toDist } from "https://tfl.dev/@truffle/distribute@1.0.0/format/wc/index.js";

// TODO: would have to figure out how to wait for <link>.onload
const template = html`
  <style>:host { opacity: ${(x) => x.isLoaded ? "inherit" : "0"} }</style>
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
  "fast",
  {
    decoratorObj: {
      template,
      shadowOptions: null, // light-dom
    },
    Class: Stylesheet,
  },
  import.meta.url,
);
