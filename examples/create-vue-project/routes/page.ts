import { toDist } from "https://tfl.dev/@truffle/distribute@^1.0.0/format/wc/index.ts";

import Page from "./page.vue";

export default toDist("vue", Page, import.meta.url);
