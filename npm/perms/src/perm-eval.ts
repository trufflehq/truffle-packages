import { Perm } from "./perm";

export type PermEvalFunc<TParams = any, TContext = any> = (
  perm: Perm<TParams>,
  context: TContext
) => boolean;

export interface PermEval {
  action: string;
  hasPermission: PermEvalFunc<unknown, unknown>;
  fallback?: PermEval;
}
