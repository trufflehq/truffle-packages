// NOTE: this lib *cannot ever* have any breaking changes
// it *can* be updated, without breaking changes, and can be versioned

// this is so the global context remains consistent between all components
// we have @truffle/global-context@1.0.0/index.js that needs to always return a backwards-compatible context

// ** THE ONE DIFFERENCE BETWEEN CLIENT AND SERVER, is when context.getStore is called outside of run() fn:
// in node: context.getStore() will return undefined
// in client: context.getStore() will return the store. it does not clear automatically since
//            we don't have a good way of telling when an async tree is done. in the future we can add a context.clear()
//            method (that is backwards-compatible)

// will need to use importmaps or compiler for this to not be bothersome in browser
import { AsyncLocalStorage } from 'async_hooks'

console.log('Server AsyncLocalStorage', AsyncLocalStorage)

// FIXME: browser version isn't true to spec. it doesn't create a new context per run
// https://github.com/legendecas/proposal-async-context
// options:
// 1) add a setGlobalValue() method (or something other than run) that client runs
//    throw error if client tries calling .run()
//    throw error if server tries calling .setGlobalValue
// 2) implement zone.js

const IsomorphicAsyncLocalStorage = AsyncLocalStorage || class BrowserAsyncLocalStorage {
  constructor () {
    this.store = undefined
  }

  run = (store, fn, ...args) => {
    this.store = store
    return fn(...args)
  }

  getStore = () => {
    return this.store
  }
}

// if node.js changes up their API for AsyncLocalStorage, we can't...
// THIS CLASS NEEDS TO BE 100% BACKWARDS COMPATIBLE ALWAYS
// hence why we aren't extending or returning class directly
export default class FrozenAsyncLocalStorageAsContext {
  constructor () {
    this._instance = new IsomorphicAsyncLocalStorage()
  }

  run = (store, fn, ...args) => {
    return this._instance.run(store, fn, ...args)
  }

  getStore = () => {
    return this._instance.getStore()
  }
}
