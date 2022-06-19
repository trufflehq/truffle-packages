import React, { lazy, memo, Suspense, useMemo } from "react";
import { Route, Router, Switch } from "wouter";
import staticLocationHook from "wouter/static-location";
import { useAsync } from "@ultra/react";

const isSsr = globalThis?.Deno;

export default function Routing({ state }) {
  const nestedRouters = useAsync(
    "nested-layouts",
    () =>
      isSsr &&
      import("./fs-router-server.tsx").then(({ nestedRouters }) =>
        nestedRouters
      ),
  );
  console.log("nested", nestedRouters);

  const nestedComponents = useMemo(
    () => getNestedComponents(nestedRouters, state),
    [],
  );

  return <Suspense>{nestedComponents}</Suspense>;
}

function getNestedComponents(router, state) {
  const Layout = router.layout
    ? lazy(() => import(router.layout))
    : ({ children }) => children;
  const Page = router.page ? lazy(() => import(router.page)) : () => "";

  console.log("nested...", state.url.pathname, router.base);

  return (
    <Router
      base={router.base}
      key={router.base}
      hook={isSsr ? staticLocationHook(state.url.pathname) : undefined}
    >
      {/* Layout needs to be scoped within a route, otherwise it shows for any route/route */}
      <Route path="/:any*">
        <Layout>
          {/* need another router due to route above */}
          <Router
            base={router.base}
            key={`${router.base}-inner`}
            hook={isSsr ? staticLocationHook(state.url.pathname) : undefined}
          >
            <Route path="/">
              <Suspense>
                <Page />
              </Suspense>
            </Route>
          </Router>
          {router.children.map((child) => getNestedComponents(child, state))}
        </Layout>
      </Route>
    </Router>
  );
}
