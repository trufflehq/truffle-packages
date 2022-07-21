import { OrgUserModel, RoleSlug } from "../models/mod.ts";

export function hasPermission(orgUser: OrgUserModel | undefined, roleSlug: RoleSlug) {
  if (!orgUser) return false;

  const roles = orgUser?.roleConnection?.nodes;

  console.log("roles", roles);

  const hasRole = roles?.find((role) => role?.slug === roleSlug);
  console.log("hasRole", hasRole);

  return Boolean(hasRole);
}
