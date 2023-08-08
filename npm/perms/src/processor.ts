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
          `Attempted to overwrite an existing permEval ${permEval.action}.`
        );
      }

      this._permEvalMap.set(permEval.action, permEval);

      // if the perm eval has a fallback, register that one too
      if (permEval.fallback) registerOne(permEval.fallback);
    };

    if (Array.isArray(permEvals)) permEvals.forEach(registerOne);
    else registerOne(permEvals);
  }

  public evaluate(
    action: string,
    perms: Perm | Perm[],
    context?: unknown,
    maxFallbacks = 20
  ): PermEvalResult {

    // evaluate a single perm
    const evalPerm = (perm: Perm) => {
      let currentPermEval: PermEval | undefined =
        // if the user registered a permEval for this action, we'll use it
        this._permEvalMap.get(action) ||
        // if the user didn't register a permEval for this action, we'll use a default one
        // that simply checks if the action matches the perm eval's action
        permEval(action);

      // only iterate through the fallbacks a certain number of times
      // in case there's a circular fallback chain
      for (let iterations = 0; iterations < maxFallbacks; iterations++) {
        if (!currentPermEval) return defaultResult;

        // match up the perm's action with the current permEval's action
        if (perm.action === currentPermEval.action) {
          // and check if the perm triggers an explicit grant or denial of permission
          const result = currentPermEval.hasPermission(perm, context);
          if (result.result !== 'undetermined') {
            return result;
          }
        }

        // if the perm doesn't satisfy the current permEval, check the fallback
        currentPermEval = currentPermEval.fallback || this.globalFallback;
      }

      return defaultResult;
    };

    // if we're given a list of perms, only one has to grant/deny permission;
    // first one to do so returns the result
    if (Array.isArray(perms)) {
      let result: PermEvalResult = defaultResult;
      perms.find((perm) => {
        const _result = evalPerm(perm);
        if (_result.result !== 'undetermined') {
          result = _result;
          return true;
        }
      });
      return result;
    } else {
      return evalPerm(perms);
    }
  }
}
