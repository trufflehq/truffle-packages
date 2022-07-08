import { customElement } from "https://npm.tfl.dev/@microsoft/fast-element@beta";

export function defineAndGetWebComponent(
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
