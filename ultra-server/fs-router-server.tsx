import glob from "https://npm.tfl.dev/glob@8";
import { existsSync } from "https://deno.land/std@0.144.0/fs/mod.ts";

const dir = "./routes";
const routers = getRouters();

export const nestedRouters = getNestedRouters("");

console.log("n1", nestedRouters);

function getRouters() {
  return glob
    // only match directories
    .sync(`**/*/`, { cwd: dir })
    .map((route) => `/${route.substr(0, route.length - 1)}`); // get rid of trailing slash
}

function getNestedRouters(base) {
  const depth = base.match(/\//g)?.length || 0;
  return {
    base,
    page: existsSync(`${dir}${base}/page.tsx`) &&
      getPath(`${base}/page.tsx`),
    layout: existsSync(`${dir}${base}/layout.tsx`) &&
      getPath(`${base}/layout.tsx`),
    children: routers
      .filter((childRouter) => {
        const childDepth = childRouter.match(/\//g)?.length;

        return childDepth === depth + 1 &&
          (!base || childRouter.indexOf(base) !== -1);
      })
      .map((childRouter) => getNestedRouters(childRouter)),
  };
}

function getPath(localPath) {
  // return `file://${path.resolve(dir, localPath)}`
  // TODO: don't want deno to cache this...
  // TODO: get file imports working for client-side fs-routing
  return new URL(
    `${dir}${localPath}.compiled.js`,
    "http://localhost:50410/@ultra/compiler/",
  ).toString();
}
