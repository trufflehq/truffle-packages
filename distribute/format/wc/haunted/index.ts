// the default lit import by haunted has some issues with ssr
// SyntaxError: Detected cycle while resolving name '_$LE' in '/v86/lit-element@3.2.1/X-ZC9yZWFjdC1kb21AMC4wLjAtZXhwZXJpbWVudGFsLTMwZWIyNjdhYi0yMDIyMDcwOCxyZWFjdEAwLjAuMC1leHBlcmltZW50YWwtMzBlYjI2N2FiLTIwMjIwNzA4/es2015/lit-element.js'
// it's an esm.sh issue, but using skypack this fixes for now
import { component as toComponent } from "../../../../pinned-libs/haunted.ts";

import { addFormat, urlToTagName } from "../shared.ts";

export function defineAndGetWebComponent(component, tagName) {
  // in theory we should be able to extend this lit class to set static styles
  // but first experimentation with it didn't work
  const webComponent = toComponent(component);

  customElements.define(tagName, webComponent);
  return {
    webComponent,
    libSlug: "haunted-lit",
    libSemver: "5",
  };
}

export function toDist(component, url) {
  const tagName = urlToTagName(url);
  const base = defineAndGetWebComponent(component, tagName);
  return addFormat({ ...base, tagName });
}
