import hauntedDefineAndGetWebComponent from "./lib/haunted/to-web-component.ts";
import reactDefineAndGetWebComponent from "./lib/react/to-web-component.ts";
import fastFoundationDefineAndGetWebComponent from "./lib/fast-foundation/to-web-component.ts";

function kebabCase(str) {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .join("-")
    .toLowerCase();
}

function urlToTagName(url) {
  return kebabCase(url.replace(/https?:\/\//i, ""));
}

export function toWebComponent(from, component, url) {
  const tagName = urlToTagName(url);
  let webComponent, libSlug, libSemver;
  switch (from) {
    case "haunted":
      ({ webComponent, libSlug, libSemver } = hauntedDefineAndGetWebComponent(
        component,
        tagName,
      ));
      break;
    case "fast-foundation":
      ({ webComponent, libSlug, libSemver } =
        fastFoundationDefineAndGetWebComponent(
          component,
          tagName,
        ));
      break;
    case "react":
      ({ webComponent, libSlug, libSemver } = reactDefineAndGetWebComponent(
        component,
        tagName,
      ));
      break;
    default:
      console.log('Invalid "from"');
  }
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
