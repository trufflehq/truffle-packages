import { DesignSystem } from "https://cdn.skypack.dev/@microsoft/fast-foundation@alpha";

export function defineAndGetWebComponent(definition, tagName) {
  const [prefix, ...rest] = tagName.split("-");
  const baseName = rest.join("-");
  return {
    webComponent: DesignSystem.getOrCreate().register(
      definition({ prefix, baseName }),
    ),
    libSlug: "fast-foundation",
    libSemver: "3.0.0-alpha",
  };
}
