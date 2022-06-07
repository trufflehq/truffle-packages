// NOTE: this file should always be imported via 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'

// this version on @truffle/context can change, but the resulting context needs to be backwards compatible
// DO NOT VERSION THIS FILE
import Context, { configure as configureContext } from 'https://tfl.dev/@truffle/context@1.0.0/index.js'

const context = new Context()
export default context

// https://nodejs.org/api/esm.html#cannot-load-non-network-dependencies
// node.js network-imported modules as of v18.2.0 cannot access local dependencies (eg fs or async_hooks).
// the pattern they suggest is passing those in via a configure fn.
// if/when node.js allows access to local dependencies, we can replace this fn with a stub that does nothing
// (still need to keep it since we cannot have breaking changes in this file).
// This needs to always be called if using via SSR
export function configure (opts) {
  configureContext(opts)
}
