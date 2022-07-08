import {
  FASTElement,
  html,
} from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import { toDist } from "https://tfl.dev/@truffle/distribute@1.0.0/format/wc/index.js";

const template = html`
  <a
    @click="${(x, c) => {
  console.log(x, c.event);
}}"
    href="${(x) => x.attributes.href}"
  ></a>`;

export default toDist(
  "fast",
  {
    decoratorObj: {
      template,
      shadowOptions: null, // light-dom
    },
    Class: FASTElement,
  },
  import.meta.url,
);
