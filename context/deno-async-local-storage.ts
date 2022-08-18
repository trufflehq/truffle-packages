// FIXME: implement with async hooks when this gets merged:
// https://github.com/denoland/deno/issues/5638
import { GlobalStore } from "./types.ts";
export default class ServerAsyncLocalStorage {
  constructor() {
    this.store = undefined;
  }

  private store?: GlobalStore;

  run = (store: GlobalStore, fn: (...args: any[]) => void, ...args) => {
    this.store = store;
    return fn(...args);
  };

  getStore = () => {
    return this.store;
  };
}
