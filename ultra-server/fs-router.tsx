import React, { lazy, memo, Suspense, useMemo } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
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

  return (
    <Suspense>
      <Routes>{nestedComponents}</Routes>
    </Suspense>
  );
}

function getNestedComponents(router, state) {
  const Layout = router.layout
    ? lazy(() => import(router.layout))
    : ({ children }) => children;
  const Page = router.page ? lazy(() => import(router.page)) : () => "";

  console.log("nested...", state.url.pathname, router.base);

  return (
    <Route
      path={router.base}
      element={
        <Layout>
          <Outlet />
        </Layout>
      }
    >
      <Route index element={<Page />} />
      {router.children.map((child) => getNestedComponents(child, state))}
    </Route>
  );
}
