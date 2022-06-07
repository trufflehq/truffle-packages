// NOTE: this lib *cannot ever* have any breaking changes
// it *can* be updated, without breaking changes, and can be versioned

// this is so the global context remains consistent between all components
// we have @truffle/global-context@1.0.0/index.js that needs to always return a backwards-compatible context

// ** THE ONE DIFFERENCE BETWEEN CLIENT AND SERVER, is when context.getStore is called outside of run() fn:
// in node: context.getStore() will return undefined
// in client: context.getStore() will return the store. it does not clear automatically since
//            we don't have a good way of telling when an async tree is done. in the future we can add a context.clear()
//            method (that is backwards-compatible)

// FIXME: browser version isn't true to spec. it doesn't create a new context per run
// https://github.com/legendecas/proposal-async-context
// options:
// 1) add a setGlobalValue() method (or something other than run) that client runs
//    throw error if client tries calling .run()
//    throw error if server tries calling .setGlobalValue
// 2) implement zone.js

class BrowserAsyncLocalStorage {
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

const isSsr = typeof document === 'undefined'
// browser can be ready immediately. for node we need to wait for configure call
let IsomorphicAsyncLocalStorage = isSsr ? undefined : BrowserAsyncLocalStorage

export function configure ({ AsyncLocalStorage } = {}) {
  console.log('config', AsyncLocalStorage)
  IsomorphicAsyncLocalStorage = AsyncLocalStorage
}

// if node.js changes up their API for AsyncLocalStorage, we can't...
// THIS CLASS NEEDS TO BE 100% BACKWARDS COMPATIBLE ALWAYS
// hence why we aren't extending or returning class directly
class FrozenAsyncLocalStorageAsContext {
  // nothing outside of this file should ever rely on this as we'll likely kill it someday
  // (if/when node supports importing local deps from network import)
  _private_doNotUse_setInstanceIfNotExists = () => {
    if (!this._instance && IsomorphicAsyncLocalStorage) {
      this._instance = new IsomorphicAsyncLocalStorage()
    } else if (!this._instance) {
      console.warn('In SSR, you must call configure method before using context functions')
    }
  }

  run = (store, fn, ...args) => {
    this._private_doNotUse_setInstanceIfNotExists()
    return this._instance?.run(store, fn, ...args)
  }

  getStore = () => {
    this._private_doNotUse_setInstanceIfNotExists()
    return this._instance?.getStore()
  }
}

export default FrozenAsyncLocalStorageAsContext
