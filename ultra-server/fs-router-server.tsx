import glob from "https://npm.tfl.dev/glob@8";
import * as path from "https://deno.land/std@0.144.0/path/mod.ts";

// FIXME: simplify router. maybe do router for each directory in /routes
// then add in page and layout if they exist top-level in that dir
// FIXME: make sure rest of ultra stuff works ok
const pages = getRoutes("page");
const layouts = getRoutes("layout");
console.log(pages, layouts);

export const nestedRouters = getNestedRouters("/");

function getRoutes(filePrefix) {
  const dir = "./routes";
  return glob
    .sync(`**/${filePrefix}.+(tsx|ts|jsx|js)`, { cwd: dir })
    .sort(compare)
    .map((file) => ({
      // path: `file://${path.resolve(dir, file)}`,
      // TODO: don't want deno to cache this...
      // TODO: get file imports working for client-side fs-routing
      path: new URL(
        `${dir}/${file}.compiled.js`,
        "http://localhost:50410/@ultra/compiler/",
      ).toString(),
      route: `/${
        file.replace(new RegExp(`(/|\)${filePrefix}\.(t|j)sx?$`), "")
      }`,
    }));
}

function getNestedRouters(route) {
  const router = {};
  router.base = route === "/" ? "" : route;
  router.layout = layouts.find((layout) => layout.route === route)?.path;
  router.children = layouts
    .filter((layout) =>
      layout.route !== route && layout.route.indexOf(route) !== -1
    )
    .map((layout) => getNestedRouters(layout.route));
  router.pages = pages
    .filter((page, i) => {
      if (page.route.indexOf(route) !== -1) {
        pages.splice(i, 1); // don't route to this in different router elsewhere
        return true;
      }
    });
  // .map((page) => ({
  //   ...page,
  //   route: page.route.replace(router.base, ""),
  // }));

  return router;
}

// https://github.com/kogosoftwarellc/open-api/blob/master/packages/fs-routes/index.ts
function compare(a: string, b: string) {
  let result;
  const ar = {
    dirname: path.dirname(a).replace(/^\./g, ""),
    basename: path.basename(a).replace(/\:/g, "~"),
  };
  const br = {
    dirname: path.dirname(b).replace(/^\./g, ""),
    basename: path.basename(b).replace(/\:/g, "~"),
  };

  if (ar.dirname === br.dirname) {
    result = 1;
    if (ar.basename > br.basename) {
      result = -1;
    }
  } else {
    result = -1;
    if (ar.dirname < br.dirname) {
      result = 1;
    }
  }

  return result;
}
