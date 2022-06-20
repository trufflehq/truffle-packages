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

  return {
    path,
    page: existsSync(`${dir}${path}/page.tsx`) &&
      `${dir}${path}/page.tsx`,
    layout: existsSync(`${dir}${path}/layout.tsx`) &&
      `${dir}${path}/layout.tsx`,
    children: routes
      .filter((childRoute) => {
        const childDepth = childRoute.match(/\//g)?.length;
        return childDepth === depth + 1 && childRoute.indexOf(path) !== -1;
      })
      .map((childRoute) => getNestedRoutes(childRoute)),
  };
}
