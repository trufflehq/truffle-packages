import { Perm } from './perm';
import { PermEval, PermEvalResult } from './perm-eval';
import { defaultResult, permEval } from './util';

export class PermsProcessor {
  private _permEvalMap = new Map<string, PermEval>();

  // this gets used as the fallback if
  // the `evaluate` method reaches a permEval
  // that doesn't have a fallback
  public globalFallback?: PermEval;

  constructor(permEvals?: PermEval | PermEval[]) {
    if (permEvals) this.register(permEvals);
  }

  public register(permEvals: PermEval | PermEval[]) {
    const registerOne = (permEval: PermEval) => {
      // check to make sure we're not accidentally overwriting a permEval
      if (
        this._permEvalMap.has(permEval.action) &&
        this._permEvalMap.get(permEval.action) !== permEval
      ) {
        throw new Error(
          `Attempted to overwrite an existing permEval ${permEval.action}.`,
        );
      }

      this._permEvalMap.set(permEval.action, permEval);

      // if the perm eval has fallbacks, register that one too
      if (Array.isArray(permEval.fallbacks))
        permEval.fallbacks.forEach(registerOne);
    };

    if (Array.isArray(permEvals)) permEvals.forEach(registerOne);
    else registerOne(permEvals);
  }

  public evaluate(
    action: string,
    perms: Perm | Perm[],
    context?: unknown,
    maxFallbacks?: number,
  ): PermEvalResult {
    // evaluate a single perm
    const evalPerm: (
      perm: Perm,
      nextPermEval?: PermEval,
      ttl?: number,
    ) => PermEvalResult = (perm, nextPermEval, ttl = 100) => {
      const currentPermEval: PermEval | undefined =
        // if we're recursing, use the permEval we were given
        nextPermEval ||
        // if the user registered a permEval for this action, we'll use it
        this._permEvalMap.get(action) ||
        // if the user didn't register a permEval for this action, we'll use a default one
        // that simply checks if the action matches the perm eval's action
        permEval(action);

      // base case: if we've reached the end of the fallback chain,
      // return the default result.
      // also, if we've reached the max number of fallbacks, return the default result
      if (!currentPermEval || ttl === 0) return defaultResult;

      // match up the perm's action with the current permEval's action
      if (perm.action === currentPermEval.action) {
        // and check if the perm triggers an explicit grant or denial of permission
        const result = currentPermEval.hasPermission(perm, context);
        if (result.result !== 'undetermined') {
          return result;
        }
      }

      // if the perm doesn't satisfy the current permEval, check the fallbacks
      if (Array.isArray(currentPermEval.fallbacks))
        for (const fallback of currentPermEval.fallbacks) {
          const result = evalPerm(perm, fallback, ttl - 1);
          if (result.result !== 'undetermined') {
            return result;
          }
        }

      return defaultResult;
    };

    // if we're given a list of perms, only one has to grant/deny permission;
    // first one to do so returns the result
    if (Array.isArray(perms)) {
      for (const perm of perms) {
        const result = evalPerm(perm, undefined, maxFallbacks);
        if (result.result !== 'undetermined') {
          return result;
        }
      }
      return defaultResult;
    } else {
      return evalPerm(perms, undefined, maxFallbacks);
    }
  }
}
