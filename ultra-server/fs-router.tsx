import React, { lazy, memo, Suspense, useMemo } from "react";
import { Route, Router } from "wouter";
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

  console.log("nested...", router);

  return (
    <Router
      base={router.base}
      hook={isSsr ? staticLocationHook(state.url.pathname) : undefined}
    >
      <Layout>
        {router.pages.map((page) => {
          console.log(router, page);

          const Page = page && lazy(() => import(page.path));
          return (
            <Route path={page.route}>
              <Suspense>
                <Page />
              </Suspense>
            </Route>
          );
        })}
        {router.children.map((child) => (
          <Route path={child.base}>{getNestedComponents(child, state)}</Route>
        ))}
      </Layout>
    </Router>
  );
}
