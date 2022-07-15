import { customElement } from "https://npm.tfl.dev/@microsoft/fast-element@beta";

import { addFormat, urlToTagName } from "../../shared.ts";

function defineAndGetWebComponent(
  { Class, decoratorObj },
  tagName,
) {
  @customElement({ name: tagName, ...decoratorObj })
  class WebComponentClass extends Class {}

  return {
    tagName,
    webComponent: WebComponentClass,
    libSlug: "fast-foundation",
    libSemver: "3.0.0-alpha",
  };
}

export function toDist({ Class, decoratorObj }, url) {
  const tagName = urlToTagName(url);
  const base = defineAndGetWebComponent({ Class, decoratorObj }, tagName);
  return addFormat(base);
}
