https://npm.tfl.dev/react-streaming / https://esm.sh/react-streaming esm.sh
bundles internal deps, which means server.js importing provider from
useSsrData.js gets bundled. so the provider is imported locally and doesn't
share the same context as standalone useSsrData.js

when this is fixed, we can just use https://npm.tfl.dev/react-streaming

changes made:

- added .js to all relative imports
- add https://npm.tfl.dev to all external imports (including dynamic imports)
