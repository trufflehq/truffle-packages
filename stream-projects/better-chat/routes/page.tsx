import { FASTElement } from "https://npm.tfl.dev/@microsoft/fast-element@2.0.0-beta.3";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.5/format/wc/fast/index.ts";
import isSsr from "https://tfl.dev/@truffle/utils@~0.0.3/ssr/is-ssr.ts";

import { listen } from '../util/mutation-observer.ts'

if (!isSsr) {
  listen();
}

// empty web component (don't need to render any ui)
export default toDist({ Class: FASTElement }, import.meta.url);
