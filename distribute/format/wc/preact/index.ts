import registerPreactComponent from "https://npm.tfl.dev/preact-custom-element";

import { addFormat, urlToTagName } from "../shared.ts";

export function defineAndGetWebComponent(
  component: any,
  tagName: string,
  { isShadowDom = true } = {},
) {
  registerPreactComponent(component, tagName, [], {
    shadow: isShadowDom,
  }) as unknown as CustomElementConstructor;

  const webComponent = customElements.get(tagName);

  return {
    libSlug: "pract-custom-element",
    libSemver: "1",
    webComponent,
  };
}

export function toDist(component, url) {
  const tagName = urlToTagName(url);
  const base = defineAndGetWebComponent(component, tagName);
  return addFormat({ ...base, tagName });
}
