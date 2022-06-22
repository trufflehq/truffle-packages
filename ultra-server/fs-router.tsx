import React, { lazy, Suspense, useMemo } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { useAsync } from "@ultra/react";

import config from "https://tfl.dev/@truffle/utils@0.0.1/config/config.js";

const isSsr = globalThis?.Deno;

export default function Routing() {
  const nestedRoutes = useAsync(
    "nested-layouts",
    () =>
      isSsr &&
      import("./fs-router-server.tsx").then(({ nestedRoutes }) => nestedRoutes),
  );

  const nestedComponents = useMemo(
    () => getNestedComponents(nestedRoutes),
    [],
  );

  return (
    <Suspense>
      <Routes>{nestedComponents}</Routes>
    </Suspense>
  );
}

function getNestedComponents(route) {
  console.log("route", route);

  const Layout = route.layout
    ? lazy(() => import(getUrl(route.layout)))
    : ({ children }) => children;
  // so layouts can be nextjs style and don't need <Outlet />
  const LayoutWrapper = () => (
    <Layout>
      <Outlet />
    </Layout>
  );
  const Page = route.page ? lazy(() => import(getUrl(route.page))) : () => "";

  console.log("path", route.path);

  return (
    <Route
      path={route.path}
      key={JSON.stringify(route)}
      element={<LayoutWrapper />}
    >
      <Route index element={<Page />} />
      {route.children.map(getNestedComponents)}
    </Route>
  );
}

function getUrl(localPath) {
  // return `file://${path.resolve(dir, localPath)}`
  // TODO: don't want deno to cache this...
  // TODO: get file imports working for client-side fs-routing
  try {
    return new URL(
      `${localPath}.compiled.js`,
      `${getLocation()}/@ultra/compiler/`,
    ).toString();
  } catch (err) {
    console.error("error constructing url", localPath, getLocation());
    console.error(err);
  }
}

function getLocation() {
  let host;
  if (globalThis?.Deno) {
    // NOTE: we can't include ULTRA_PORT, since we change from 8080 -> 80 in nginx
    host = globalThis?.Deno?.env.get("ULTRA_HOST") ||
      "localhost:8000";
  } else {
    host = window.location.host;
  }
  const protocol = config.IS_DEV_ENV ? "http:" : "https:";
  return `${protocol}//${host}`;
}
