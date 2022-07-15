import { DesignSystem } from "https://npm.tfl.dev/@microsoft/fast-foundation@alpha";

import { addFormat, urlToTagName } from "../shared.ts";

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

export function toDist(definition, url) {
  const tagName = urlToTagName(url);
  const base = defineAndGetWebComponent(definition, tagName);
  return addFormat({ ...base, tagName });
}
