import { Perm } from './perm';

export interface PermEvalResult {
  result: 'granted' | 'denied' | 'undetermined';
  reason?: string;
  reasonCode?: string;
}

export type PermEvalFunc<TParams = any, TContext = any> = (
  perm: Perm<TParams>,
  context: TContext
) => PermEvalResult;

export interface PermEval {
  action: string;
  hasPermission: PermEvalFunc<unknown, unknown>;
  fallbacks?: PermEval[];
}
