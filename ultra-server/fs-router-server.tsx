import glob from "https://npm.tfl.dev/glob@8";
import { existsSync } from "https://deno.land/std@0.144.0/fs/mod.ts";

const dir = "./routes";
const routes = getRoutes();

export const nestedRoutes = getNestedRoutes();

function getRoutes() {
  return glob
    // only match directories
    .sync(`**/*/`, { cwd: dir })
    .map((route) => `/${route.substr(0, route.length - 1)}`); // get rid of trailing slash
}

function getNestedRoutes(path = "") {
  const depth = path.match(/\//g)?.length || 0;

  const pagePath = existsSync(`${dir}${path}/page.tsx`) &&
    `${dir}${path}/page.tsx`;
  const layoutPath = existsSync(`${dir}${path}/layout.tsx`) &&
    `${dir}${path}/layout.tsx`;

  // nextjs style catch alls `[...slug]`. dir names can't be * on windows
  // TODO: support the difference between [[...slug]] and [...slug]
  // https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes)
  path = path.replace(/\[?\[\.\.\.(.*?)\]\]?/, "*");
  // /abc/[param] -> /abc/:param
  path = path.replace(/\[(.*?)\]/, ":$1");

  return {
    path: path || "/",
    page: pagePath,
    layout: layoutPath,
    children: routes
      .filter((childRoute) => {
        const childDepth = childRoute.match(/\//g)?.length;
        const isNextDepth = childDepth === depth + 1;
        const isSubroute = childRoute.indexOf(path) !== -1;
        return isNextDepth && isSubroute;
      })
      .map((childRoute) => getNestedRoutes(childRoute)),
  };
}
