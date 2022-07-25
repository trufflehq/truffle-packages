function kebabCase(str) {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .join("-")
    .toLowerCase();
}

export function urlToTagName(url) {
  return kebabCase(url.replace(/https?:\/\//i, ""));
}

export function addFormat(base) {
  return {
    ...base,
    // so other files know how to parse this component's export
    _componentFormatSlug: "wc",
    _componentFormatSemver: "1", // wc@1 is { tagName, webComponent, libSlug, libSemver}
  };
}
