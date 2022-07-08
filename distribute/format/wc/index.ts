import { defineAndGetWebComponent as fastDefineAndGetWebComponent } from "./lib/fast/index.ts";
import { defineAndGetWebComponent as fastFoundationDefineAndGetWebComponent } from "./lib/fast-foundation/index.ts";
import { defineAndGetWebComponent as hauntedDefineAndGetWebComponent } from "./lib/haunted/index.ts";
import { defineAndGetWebComponent as reactDefineAndGetWebComponent } from "./lib/react/index.ts";

function kebabCase(str) {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .join("-")
    .toLowerCase();
}

function urlToTagName(url) {
  return kebabCase(url.replace(/https?:\/\//i, ""));
}

const defineAndGetWebComponentFns = {
  "fast": fastDefineAndGetWebComponent,
  "fast-foundation": fastFoundationDefineAndGetWebComponent,
  "haunted": hauntedDefineAndGetWebComponent,
  "react": reactDefineAndGetWebComponent,
};

export function toDist(from, component, url) {
  const tagName = urlToTagName(url);
  const defineAndGetWebComponentFn = defineAndGetWebComponentFns[from];
  const { webComponent, libSlug, libSemver } = defineAndGetWebComponentFn(
    component,
    tagName,
  );

  return {
    tagName,
    webComponent,
    libSlug,
    libSemver,
    // so other files know how to parse this component's export
    _componentFormatSlug: "wc",
    _componentFormatSemver: "1", // wc@1 is { tagName, webComponent, libSlug, libSemver}
  };
}
