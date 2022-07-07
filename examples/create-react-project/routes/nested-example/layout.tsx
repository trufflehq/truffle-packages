import { component } from 'https://npm.tfl.dev/haunted@5.0.0?bundle';
import { html, unsafeStatic } from "https://npm.tfl.dev/lit-html@2/static";

function NestedExampleLayout({ children }) {
  return html`
    This is a layout that applies to all nested children
    ${children}
  `
}

// export default toWebComponent(NestedExampleLayout)

const elementName = "truffle-layout";
customElements.define(elementName, component(NestedExampleLayout));
export default elementName