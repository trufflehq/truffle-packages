import globalContext from "https://tfl.dev/@truffle/global-context@1.0.0/index.js";
import UniversalRouter from "https://npm.tfl.dev/universal-router@9";

export function setRoutes(routes) {
  const context = globalContext.getStore();
  context.router = new UniversalRouter(routes);
}

export function getRouter() {
  const context = globalContext.getStore();
  return context.router;
}
