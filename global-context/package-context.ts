// leave as absolute url so we get same context instance
import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import type { Client } from "https://npm.tfl.dev/@urql/core@^3.0.0";

export function getPackageContext(
  packagePath: string,
): Record<string, unknown> | undefined {
  if (!packagePath) {
    console.error("Must specify package");
    return;
  }
  const context = globalContext.getStore();
  // important that this creates the object if it doesn't exist when read.
  // so setPackageContext can modify the correct object in-place
  context.packages = context.packages || {};
  context.packages[packagePath] = context.packages[packagePath] || {};
  return context.packages[packagePath];
}

export interface PackageContext extends Record<string, unknown> {
  client: Client;
}

export function setPackageContext(
  packagePath: string,
  diff: PackageContext,
) {
  if (!packagePath) {
    console.error("Must specify package");
    return;
  }
  const packageContext = getPackageContext(packagePath);
  Object.assign(packageContext, diff);
  return packageContext;
}
