import {
  customElement,
  FASTElement,
  html,
  observable,
} from "https://npm.tfl.dev/@microsoft/fast-element@beta";

// TODO: would have to figure out how to wait for <link>.onload
const template = html`
  <style>:host { opacity: ${(x) => x.isLoaded ? "inherit" : "0"} }</style>
  <link
    @load=${(x) => x.isLoaded = true}
    rel="stylesheet"
    href="${(x) => x.url.toString()}"
  />`;

const elementName = "truffle.ui-stylesheet";

@customElement({
  name: elementName,
  template,
  shadowOptions: null, // light-dom
})
export class Stylesheet extends FASTElement {
  @observable
  isLoaded: boolean = false;
}

export default elementName;
