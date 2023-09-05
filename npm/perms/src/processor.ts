import { Perm } from './perm';
import { PermEval, PermEvalResult } from './perm-eval';
import { defaultHasPermissionFunc, DEFAULT_RESULT, permEval } from './util';

type PermRankStrategy = 'eval-order' | 'fallback-depth';

interface PermsProcessorOptions {
  /**
   * Default permEval to use if the processor reaches the end of the fallback chain.
   */
  globalFallback?: PermEval;

  /**
   * How prioritize which permission to return the result for
   * when evaluating multiple permissions.
   *
   * - `eval-order`: return the result for the first permission that returns an
   * explicit grant or denial of permission.
   *
   * - `fallback-depth`: return the result for the permission that interated
   * through the fewest number of fallbacks before returning a result. This
   * makes it so that the result for the "most specific" permission is returned.
   *
   * The default strategy is `fallback-depth`.
   */
  permRankStrategy?: PermRankStrategy;
}

const DEFAULT_MAX_FALLBACKS = 100;

export class PermsProcessor {
  private _permEvalMap = new Map<string, PermEval>();

  // this gets used as the fallback if
  // the `evaluate` method reaches a permEval
  // that doesn't have a fallback
  public globalFallback?: PermEval;

  private _permRankStrategy: PermRankStrategy;

  constructor(options: PermsProcessorOptions = {}) {
    this.globalFallback = options.globalFallback;
    this._permRankStrategy = options.permRankStrategy || 'fallback-depth';
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
    maxFallbacks = DEFAULT_MAX_FALLBACKS,
  ): PermEvalResult {
    // evaluate a single perm
    const evalPerm: (
      perm: Perm,
      nextPermEval?: PermEval,
      ttl?: number,

      // we return the final ttl in the tuple so that we can
      // use it to determine how many fallbacks
      // were evaluated before returning a result
      // and use that info to determine which
      // result to return when evaluating multiple perms
      // if the user has specified the `fallback-depth` strategy
    ) => [PermEvalResult, number] = (
      perm,
      nextPermEval,
      ttl = DEFAULT_MAX_FALLBACKS,
    ) => {
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
      if (!currentPermEval || ttl === 0) return [DEFAULT_RESULT, ttl];

      // match up the perm's action with the current permEval's action
      if (perm.action === currentPermEval.action) {
        // and check if the perm triggers an explicit grant or denial of permission
        const result = currentPermEval.hasPermission
          ? currentPermEval.hasPermission(perm, context)
          : defaultHasPermissionFunc(perm);

        if (result.result !== 'undetermined') {
          return [result, ttl];
        }
      }

      // if the perm doesn't satisfy the current permEval, check the fallbacks
      if (Array.isArray(currentPermEval.fallbacks))
        for (const fallback of currentPermEval.fallbacks) {
          const [result, finalTtl] = evalPerm(perm, fallback, ttl - 1);
          if (result.result !== 'undetermined') {
            return [result, finalTtl];
          }
        }

      return [DEFAULT_RESULT, ttl];
    };

    // if we're given a list of perms, only one has to grant/deny permission;
    if (Array.isArray(perms)) {
      if (this._permRankStrategy === 'eval-order') {
        for (const perm of perms) {
          const [result] = evalPerm(perm, undefined, maxFallbacks);
          if (result.result !== 'undetermined') {
            return result;
          }
        }
        return DEFAULT_RESULT;
      } else if (this._permRankStrategy === 'fallback-depth') {
        const [result] = perms
          // evaluate each perm
          .map((perm) => evalPerm(perm, undefined, maxFallbacks))
          // filter out the results that didn't return an explicit grant/deny
          .filter(([result]) => result.result !== 'undetermined')
          // find the result with the fewest number of fallbacks
          // by comparing the final ttl of each result. the result with the
          // highest final ttl is the one that hopped the fewest number of fallbacks
          .reduce(
            (winner, curr) => (winner[1] > curr[1] ? winner : curr),
            [DEFAULT_RESULT, 0],
          );

        return result;
      } else {
        // gotta make ts happy (otherwise it thinks this function can return undefined)
        return DEFAULT_RESULT;
      }
    } else {
      const [result] = evalPerm(perms, undefined, maxFallbacks);
      return result;
    }
  }
}
