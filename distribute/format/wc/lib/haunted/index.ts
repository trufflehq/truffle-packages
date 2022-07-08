import { component as toComponent } from "https://npm.tfl.dev/haunted@5.0.0";

export function defineAndGetWebComponent(component, tagName) {
  const webComponent = toComponent(component);
  customElements.define(tagName, webComponent);
  return {
    webComponent,
    libSlug: "haunted-lit",
    libSemver: "5",
  };
}
