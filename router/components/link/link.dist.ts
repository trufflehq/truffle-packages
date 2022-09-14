import {
  css,
  FASTElement,
  html,
  observable,
  slotted,
} from "https://npm.tfl.dev/@microsoft/fast-element@2.0.0-beta.3";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/fast/index.ts";
import { push } from "https://tfl.dev/@truffle/router@^1.0.0/history.ts";

const onClick = (x, c) => {
  push(x.attributes.href.value);
};

const template = html`
  <a
    @click="${onClick}"
    href="${(x) => x.attributes.href.value}"
  >
    <slot ${slotted("defaultSlottedContent")}></slot>
  </a>`;

const styles = css`
  :host a {
    color: inherit;
  }`;

class Link extends FASTElement {
  @observable
  public defaultSlottedContent: HTMLElement[];
}

export default toDist({
  decoratorObj: {
    template,
    styles,
  },
  Class: Link,
}, import.meta.url);
