import { OrgUserModel } from "../models/mod.ts";
import { RoleSlug } from '../types/mod.ts'

export function hasPermission(
  orgUser: OrgUserModel | undefined,
  roleSlugs: RoleSlug[],
) {
  const roles = orgUser?.roleConnection?.nodes;
  if (!roles) return false;


  const hasRole = roles.find((role) => role?.slug && roleSlugs.includes(role.slug));

  return Boolean(hasRole);
}
