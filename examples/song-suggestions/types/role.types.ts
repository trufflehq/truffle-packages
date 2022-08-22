export type RoleSlug = "admin" | "moderator" | "mod" | "everyone";

export interface Role {
  id: string;
  name: string;
  slug: RoleSlug;
  rank: number;
}

export interface RoleConnection {
  nodes: Role[];
}