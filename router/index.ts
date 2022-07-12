import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.js";

export function setParams(params) {
  const context = globalContext.getStore();
  // we use top-level (not package-scoped) context since this is something that
  // truffle-dev-server/sporocarp sets
  // context.router.params needs to always exist - no breaking changes
  context.router = context.router || {};
  context.router.params = params;
  return context.router.params;
}

export function useParams() {
  const context = globalContext.getStore();
  // context.router.params needs to always exist - no breaking changes
  return context.router.params;
}
