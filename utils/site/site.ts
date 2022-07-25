import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";

export function getOrgId() {
  const context = globalContext.getStore();

  return context.orgId;
}
