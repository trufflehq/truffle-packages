// FIXME: implement with async hooks when this gets merged:
// https://github.com/denoland/deno/issues/5638
export default class ServerAsyncLocalStorage {
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
