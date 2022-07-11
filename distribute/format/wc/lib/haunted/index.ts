// the default lit import by haunted has some issues with ssr
// SyntaxError: Detected cycle while resolving name '_$LE' in '/v86/lit-element@3.2.1/X-ZC9yZWFjdC1kb21AMC4wLjAtZXhwZXJpbWVudGFsLTMwZWIyNjdhYi0yMDIyMDcwOCxyZWFjdEAwLjAuMC1leHBlcmltZW50YWwtMzBlYjI2N2FiLTIwMjIwNzA4/es2015/lit-element.js'
// it's an esm.sh issue, but this fixes for now
// the ?target=es2022 is the fix. other es versions have circular dep for some reason
import { render } from "https://npm.tfl.dev/lit@2?target=es2022";
import haunted from "https://npm.tfl.dev/haunted@5/core";

const { component: toComponent } = haunted({ render });

export function defineAndGetWebComponent(component, tagName) {
  const webComponent = toComponent(component);
  customElements.define(tagName, webComponent);
  return {
    webComponent,
    libSlug: "haunted-lit",
    libSemver: "5",
  };
}
