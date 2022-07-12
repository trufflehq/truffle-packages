import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.js";
import UniversalRouter from "https://npm.tfl.dev/universal-router@9";

// FIXME: move setRoutes and getRouter to truffle-dev-server/router.ts
// this should only expose useParams which should only rely on context.router.params (or context._router.params)

export function setRoutes(routes) {
  const context = globalContext.getStore();
  context._router = {
    params: {},
    router: new UniversalRouter(routes, {
      resolveRoute(routerCtx, params) {
        if (typeof routerCtx.route.action === "function") {
          context._router.params = routerCtx.params;
          return routerCtx.route.action(routerCtx, params);
        }
        return undefined;
      },
    }),
  };
}

export function getRouter() {
  const context = globalContext.getStore();
  return context._router.router;
}

export function useParams() {
  const context = globalContext.getStore();
  return context._router.params;
}
