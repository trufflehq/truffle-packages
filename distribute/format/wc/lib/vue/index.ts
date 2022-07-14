import { defineCustomElement } from "https://npm.tfl.dev/vue@3";

export function defineAndGetWebComponent(
  vueComponentOptions,
  tagName,
) {
  const webComponent = defineCustomElement(vueComponentOptions);

  customElements.define(tagName, webComponent);

  return {
    webComponent: webComponent,
    libSlug: "vue",
    libSemver: "3",
  };
}
