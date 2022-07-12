// leave as absolute url so we get same context instance
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";

export function getPackageContext(packagePath) {
  if (!packagePath) {
    console.error("Must specify package");
    return;
  }
  const context = globalContext.getStore();
  return context.packages?.[packagePath];
}

export function setPackageContext(packagePath, diff) {
  if (!packagePath) {
    console.error("Must specify package");
    return;
  }
  const context = globalContext.getStore();
  context.packages = context.packages || {};
  context.packages[packagePath] = context.packages[packagePath] || {};
  Object.assign(context.packages[packagePath], diff);
  return context.packages[packagePath];
}
