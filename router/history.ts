import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";
import { createBrowserHistory } from "https://npm.tfl.dev/history@5";

function getHistory() {
  const context = globalContext.getStore();
  context._history = context._history || createBrowserHistory();
  return context._history;
}

export function listen(fn) {
  return getHistory().listen(fn);
}

export function push(path) {
  return getHistory().push(path);
}
