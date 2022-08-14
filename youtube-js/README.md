# youtube-js

truffle hosted version of https://github.com/LuanRT/YouTube.js. to bump the version pull the latest commits from the upstream repo, run `npm run build` and copy over `bundle/browser.js` and `bundle/browser.d.ts`, comment out the jsx parsing section of the upsertModule function since this code is already bundled, run mycelium w/ prod scylla, and run a `truffle-cli deploy` pointed at local mycelium.
