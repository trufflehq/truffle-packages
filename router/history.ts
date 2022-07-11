import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";
import { createBrowserHistory } from "https://npm.tfl.dev/history@5";

// FIXME: move getHistory() and listen() to truffle-dev-server, so they're not exposed
// this should only expose push which should only rely on context._history
// it might even be better to call window pushState directly

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
