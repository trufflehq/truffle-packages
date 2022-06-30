import React, { lazy, Suspense, useMemo } from "https://npm.tfl.dev/react";
import {
  Outlet,
  Route,
  Routes,
} from "https://tfl.dev/@truffle/utils@0.0.1/router/router.js";
// import { useSsrData } from "https://npm.tfl.dev/react-streaming@0";
// see ./react-streaming/README.md
import { useSsrData } from "./react-streaming/useSsrData.js";

import config from "https://tfl.dev/@truffle/utils@0.0.1/config/config.js";

const isSsr = globalThis?.Deno;

export default function Routing() {
  const { nestedRoutes } = useSsrData(
    "/nested-routes",
    () => isSsr && import("./fs-router-server.tsx"),
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

  const Layout = route.layout && lazy(() => import(getUrl(route.layout)));
  const Page = route.page && lazy(() => import(getUrl(route.page)));
  // so layouts can be nextjs style and don't need <Outlet />
  let parentElement = Layout && (
    <Layout>
      <Outlet />
    </Layout>
  );

  // wildcards can't have children and don't work with index route
  const isWildcard = route.path.endsWith("*");
  if (isWildcard && Layout) {
    parentElement = (
      <Layout>
        <Page />
      </Layout>
    );
  } else if (isWildcard) {
    parentElement = <Page />;
  }

  return (
    <Route
      path={route.path}
      key={JSON.stringify(route)}
      element={parentElement || <Outlet />}
    >
      {Page && <Route index element={<Page />} />}
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
