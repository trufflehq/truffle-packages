import { _ } from "../../../deps.ts";
import {
  Filters,
  OrgUser,
  Permission,
  PermissionAction,
  Role,
} from "../../../types/org-user.types.ts";
// filters = [{ type: 'chat', id: '<chat id>' }, { type: 'chatMessage' }]
// checks for [{ type: 'chat', id: '<chat id>' }, { type: 'chatMessage' }], then [{ type: 'chatMessage' }], then global

// FIXME: need some sort of isStrict
// if isStrict, stop the mapping over ranks.
// { chat: { id: '<chat id>', isStrict: true }, message: { isAll: true }
// if match isn't found, break out of loop (don't allow global, or message: { isAll: true })

export function hasPermission(
  { filters = {}, row, rowType, actions, modelUserIdKey, orgUser }: {
    filters?: Filters;
    row?: Record<string, unknown>;
    rowType?: string;
    actions?: PermissionAction[];
    modelUserIdKey?: string;
    orgUser: OrgUser;
  },
) {
  const roles = _.orderBy(orgUser?.roleConnection?.nodes, "rank");

  const isSuperAdmin = _.find(roles, { isSuperAdmin: true });
  if (isSuperAdmin) {
    return true;
  }

  const wasCreatedByUser = modelUserIdKey && row?.[modelUserIdKey] &&
    row[modelUserIdKey] === orgUser.userId;
  if (wasCreatedByUser) {
    return true;
  }

  if (row && rowType) {
    filters[rowType].id = row.id as string;
  }

  // go through all filters, then all minus 1, all minus 2, etc... to find all potential matches
  // eg. if filters.length is 3, first grab all role permissions that match all 3, then those that match 2, then 1
  // order matters (most relevant returned first)
  const arrOfFilterCount = _.range(_.keys(filters).length);
  const rankedPermissions = _.flatten(_.map(arrOfFilterCount, (minRank) => {
    return _.filter(_.flatten(_.map(roles, (role) => {
      return getPermissionMatchesByRoleAndMinRank(filters, role, minRank);
    })));
  }));

  const globalPermissions = _.filter(_.flatten(_.map(roles, (role) => {
    return _.filter(
      role.permissionConnection.nodes,
      ({ filters }) => filters.global,
    );
  }))) as Permission[];

  const userPermissions = rankedPermissions.concat(globalPermissions);

  const hasPermissions = _.every(
    actions,
    (action) =>
      _.find(userPermissions, (permission) => {
        return permission.action === action && permission.value != null; // anything that's true or false
      })?.value,
  );

  return hasPermissions;
}

function getPermissionMatchesByRoleAndMinRank(
  filters: Filters,
  role: Role,
  minRank: number,
) {
  const filterPermissionsWithId = _.filter(
    role.permissionConnection.nodes,
    (rolePermissions) =>
      _.every(filters, ({ id, isAll, rank }, type) => {
        const isIdMatch = rolePermissions.filters[type] && id &&
          id === rolePermissions.filters[type].id;
        const isAllMatch = rolePermissions.filters[type] && isAll &&
          isAll === rolePermissions.filters[type].isAll;
        // on 2nd time through, ignore rank 0 (first in list). 3rd time through ignore 0 and 1, etc...
        // *however* we still want to ignore db-set permissions that are for a specific id
        // eg {"filters":{"chat":{"id":"4bf95890-77f4-11eb-8016-86bf0688df28","rank":0},"chatMessage":{"isAll":true,"rank":1}}
        const shouldIgnoreRank = rank < minRank &&
          !rolePermissions.filters[type]?.id;
        return isIdMatch || isAllMatch || shouldIgnoreRank;
      }),
  );
  const filterPermissionsWithoutId = _.filter(
    role.permissionConnection.nodes,
    (rolePermissions) =>
      _.every(filters, ({ isAll, rank }, type) => {
        const isTypeMatch = rolePermissions.filters[type]?.isAll;
        const shouldIgnoreRank = rank < minRank;
        return isTypeMatch || shouldIgnoreRank;
      }),
  );
  return _.flatten([filterPermissionsWithId, filterPermissionsWithoutId]);
}

export function filterByOrgUser(
  { filters, rows, rowType, actions, modelUserIdKey, orgUser }: {
    filters: Filters;
    rows: Record<string, unknown>[];
    rowType: string;
    actions: PermissionAction[];
    modelUserIdKey?: string;
    orgUser: OrgUser;
  },
) {
  return _.filter(rows, (row) => {
    if (!row) {
      return;
    }

    return hasPermission({
      filters,
      row,
      rowType,
      actions,
      modelUserIdKey,
      orgUser,
    });
  });
}
