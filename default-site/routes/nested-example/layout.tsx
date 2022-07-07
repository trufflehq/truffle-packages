import React from "https://npm.tfl.dev/react";
import toWebComponent from "https://tfl.dev/@truffle/utils@0.0.1/web-component/to-web-component.js";

import { component, useMemo, useState } from 'https://npm.tfl.dev/haunted@5.0.0';
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