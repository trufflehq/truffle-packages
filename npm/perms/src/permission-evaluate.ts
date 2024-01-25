import { Permission } from './permission';

export interface PermissionEvaluateResult {
  result: 'granted' | 'denied' | 'undetermined';
  reason?: string;
  reasonCode?: string;
}

export type PermissionEvaluateFunc<TParams = any, TContext = any> = (
  permission: Permission<TParams>,
  context: TContext
) => PermissionEvaluateResult;

export interface PermissionEvaluate {
  action: string;
  hasPermission?: PermissionEvaluateFunc<unknown, unknown>;
  fallbacks?: PermissionEvaluate[];
}

export interface PermissionEvaluateTreeBuilderNode {
  self: PermissionEvaluate;
  children?: PermissionEvaluateTreeBuilderNode[];
}