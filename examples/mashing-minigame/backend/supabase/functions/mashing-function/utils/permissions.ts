import { OrgUserModel, RoleSlug } from "../models/mod.ts";

export function hasPermission(
  orgUser: OrgUserModel | undefined,
  roleSlug: RoleSlug,
) {
  if (!orgUser) return false;

  const roles = orgUser?.roleConnection?.nodes;

  const hasRole = roles?.find((role) => role?.slug === roleSlug);

  return Boolean(hasRole);
}
