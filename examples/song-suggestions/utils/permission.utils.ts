import { OrgUser, RoleSlug } from '../types/mod.ts'

export function hasPermission(
  orgUser: OrgUser,
  roleSlugs: RoleSlug[],
) {
  if (!orgUser) return false;

  const roles = orgUser?.roleConnection?.nodes;

  const hasRole = roles?.find((role) => roleSlugs.includes(role?.slug));

  return Boolean(hasRole);
}
