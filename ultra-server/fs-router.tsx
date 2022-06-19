import React, { lazy, Suspense, useMemo } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { useAsync } from "@ultra/react";

const isSsr = globalThis?.Deno;

export default function Routing() {
  const nestedRouters = useAsync(
    "nested-layouts",
    () =>
      isSsr &&
      import("./fs-router-server.tsx").then(({ nestedRouters }) =>
        nestedRouters
      ),
  );

  const nestedComponents = useMemo(
    () => getNestedComponents(nestedRouters),
    [],
  );

  return (
    <Suspense>
      <Routes>{nestedComponents}</Routes>
    </Suspense>
  );
}

function getNestedComponents(router) {
  const Layout = router.layout
    ? lazy(() => import(router.layout))
    : ({ children }) => children;
  // so layouts can be nextjs style and don't need <Outlet />
  const LayoutWrapper = () => (
    <Layout>
      <Outlet />
    </Layout>
  );
  const Page = router.page ? lazy(() => import(router.page)) : () => "";

  return (
    <Route path={router.base} key={router.base} element={<LayoutWrapper />}>
      <Route index element={<Page />} />
      {router.children.map(getNestedComponents)}
    </Route>
  );
}
