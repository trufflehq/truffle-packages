// NOTE: this lib *cannot ever* have any breaking changes
// it *can* be updated, without breaking changes, and can be versioned

// this is so the global context remains consistent between all components
// we have @truffle/global-context@^1.0.0/index.js that needs to always return a backwards-compatible context

// There is some inconsistency between browser, Node.js, and Deno support async context tracking
// (context that persists across a single function call, even if child calls are async/callbacks)
// Node.js has AsyncLocalStorage: https://nodejs.org/api/async_context.html
// Browsers don't have anything currently implemented.
//   - there was a proposal for Zones like Zone.js in ~2019 that was rejected for being too dangerous
//     - https://gist.github.com/mhevery/63fdcdf7c65886051d55
//     - https://github.com/angular/angular/tree/main/packages/zone.js
//   - there is a current proposal: https://github.com/legendecas/proposal-async-context
//     - this was last proposed in July 2020 and they weren't very receptive
//     - https://github.com/tc39/notes/blob/167155eeb708d84e1758d99c88b15670f9b81f75/meetings/2020-07/july-23.md#async-context-updates--for-stage-1
// Deno doesn't have AsyncLocalStorage, but should have Promise hooks soon, that can support this behavior
//   - https://github.com/denoland/deno/issues/5638

// Libraries also have their own version of context, like React's Provider / useContext.
// We don't want to be tied to that though - we want to let helper methods outside of React functions
// grab context successfully.

// We're going to go with the one implementation that exists: AsyncLocalStorage, but if/when the ES spec
// implements, it may differ (https://github.com/legendecas/proposal-async-context uses setValue/getValue)

// As a (hopefully) short-term solution for browsers, we'll use setGlobalValue(val) instead of run(val, fn).
// This context won't be scoped at all, it will be global per `new Context()` instance

// TODO: client should probably importmap this to nothing
// or could try dynamic import
import DenoAsyncLocalStorage from './deno-async-local-storage.js'
// import { AsyncLocalStorage } from 'node:async_hooks'

class BrowserAsyncLocalStorage {
  constructor () {
    this.store = undefined
  }

  // TODO: don't implement run until browsers have actual async context tracking

  setGlobalValue = (store) => {
    this.store = store
  }

  getStore = () => {
    return this.store
  }
}

// THIS CLASS NEEDS TO BE 100% BACKWARDS COMPATIBLE ALWAYS
// it's modeled after Node.js AsyncLocalStorage
class FrozenAsyncLocalStorageAsContext {
  constructor () {
    const IsomorphicAsyncLocalStorage = globalThis?.Deno ? DenoAsyncLocalStorage : BrowserAsyncLocalStorage
    // const IsomorphicAsyncLocalStorage = BrowserAsyncLocalStorage
    this._instance = new IsomorphicAsyncLocalStorage()
  }

  // NOTE: you *should* be able to remove this AsyncLocalStorage argument and not worry about 
  // backwards compatibility. All that uses it is Sporocarp SSR and local dev setups
  _PRIVATE_setInstance = (asyncLocalStorageInstance) => {
    this._instance = asyncLocalStorageInstance
  }

  // sets the context to store and calls fn with the additional args that are passed in
  run = (store, fn, ...args) => {
    if (!this._instance.run) {
      throw new Error('context.run is not implemented in this runtime, use context.setGlobalValue')
    }
    return this._instance.run(store, fn, ...args)
  }

  // returns context value
  getStore = () => {
    return this._instance.getStore()
  }

  setGlobalValue = (store) => {
    if (!this._instance.setGlobalValue) {
      throw new Error('context.setGlobalValue is not implemented in this runtime, use context.run')
    }
    this._instance.setGlobalValue(store)
  }
}

export default FrozenAsyncLocalStorageAsContext
