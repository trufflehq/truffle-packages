// don't import this file directly except from ./index.ts
// that'll ensure we use the same one even if there's a 302 to ./index.ts (ie index.ts loaded multiple times)
import React from "https://npm.tfl.dev/react";

export default React.createContext();
