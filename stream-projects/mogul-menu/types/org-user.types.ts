import { ConnectionSourceType, DeepPick, TruffleGQlConnection } from "../deps.ts";
import { User } from "./user.types.ts";

export interface OrgUser {
  id: string;
  name: string;
  userId: string;
  orgId: string;
  roleIds: string[];
  bio: string;
  socials: Record<string, unknown>;
  user: User;
  roleConnection: RoleConnection;
}

export interface OrgUserChatSettings
  extends DeepPick<OrgUser, "id" | "name" | "userId" | "orgId" | "user.id"> {
  keyValue: {
    key: string;
    value: string;
  };
}

export interface OrgUserConnections extends Omit<OrgUser, "user"> {
  connectionConnection: {
    nodes: {
      id: string;
      sourceType: ConnectionSourceType;
    }[];
  };
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  rank: number;
  isSuperAdmin: boolean;
  permissionConnection: PermissionConnection;
}

export type RoleConnection = TruffleGQlConnection<Role>;

export interface Filter {
  type?: string;
  isAll?: boolean;
  id?: string;
  rank: number;
}

export interface Filters {
  [key: string]: Filter;
}

export type PermissionAction = "create" | "read" | "update" | "delete";
export interface Permission {
  filters: Filters;
  action: PermissionAction;
  value: boolean;
}

export type PermissionConnection = TruffleGQlConnection<Permission>;
