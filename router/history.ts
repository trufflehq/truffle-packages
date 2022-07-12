export function push(path, state) {
  window.history.pushState({}, "", path);
  // https://stackoverflow.com/a/37492075
  const popStateEvent = new PopStateEvent("popstate", { state });
  dispatchEvent(popStateEvent);
}
