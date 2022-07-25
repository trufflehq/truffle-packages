import { customElement } from "https://npm.tfl.dev/@microsoft/fast-element@2.0.0-beta.3";

import { addFormat, urlToTagName } from "../shared.ts";

function defineAndGetWebComponent(
  { Class, decoratorObj },
  tagName,
) {
  @customElement({ name: tagName, ...decoratorObj })
  class WebComponentClass extends Class {}

  return {
    webComponent: WebComponentClass,
    libSlug: "fast-foundation",
    libSemver: "3.0.0-alpha",
  };
}

export function toDist({ Class, decoratorObj }, url) {
  const tagName = urlToTagName(url);
  const base = defineAndGetWebComponent({ Class, decoratorObj }, tagName);
  return addFormat({ ...base, tagName });
}
