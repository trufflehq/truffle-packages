import { Fragment, h } from "https://npm.tfl.dev/preact";

export function css(strings: TemplateStringsArray, ...values: any[]) {
  const cssString = strings.reduce((acc, str, i) => {
    const value = values[i - 1];
    return acc + str + (value ? value : "");
  });
  return cssString;
}

export function Styled({ css, children }) {
  return h(Fragment, null, [
    h("style", null, css),
    h(Fragment, null, children),
  ]);
}
