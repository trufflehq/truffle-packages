import { ComponentInstance, TruffleGQlConnection } from "./mod.ts";

export type RouteConnection = TruffleGQlConnection<Route>;

export interface Route {
  id: string;
  parentId: string;
  pathWithVariables: string;
  type: string;
  componentInstance: Partial<ComponentInstance>;
}
