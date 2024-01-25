import { Permission } from './permission';
import { PermissionEvaluate, PermissionEvaluateResult } from './permission-evaluate';
import { defaultHasPermissionFunc, DEFAULT_RESULT, permissionEvaluate } from './util';

type PermissionRankStrategy = 'evaluate-order' | 'fallback-depth';

interface PermissionsProcessorOptions {
  /**
   * Default permissionEvaluate to use if the processor reaches the end of the fallback chain.
   */
  globalFallback?: PermissionEvaluate;

  /**
   * How prioritize which permission to return the result for
   * when evaluating multiple permissions.
   *
   * - `evaluate-order`: return the result for the first permission that returns an
   * explicit grant or denial of permission.
   *
   * - `fallback-depth`: return the result for the permission that interated
   * through the fewest number of fallbacks before returning a result. This
   * makes it so that the result for the "most specific" permission is returned.
   *
   * The default strategy is `fallback-depth`.
   */
  permRankStrategy?: PermissionRankStrategy;
}

const DEFAULT_MAX_FALLBACKS = 100;

export class PermissionsProcessor {
  private _permissionEvaluateMap = new Map<string, PermissionEvaluate>();

  // this gets used as the fallback if
  // the `evaluate` method reaches a permissionEvaluate
  // that doesn't have a fallback
  public globalFallback?: PermissionEvaluate;

  private _permRankStrategy: PermissionRankStrategy;

  constructor(options: PermissionsProcessorOptions = {}) {
    this.globalFallback = options.globalFallback;
    this._permRankStrategy = options.permRankStrategy || 'fallback-depth';
  }

  public register(permissionEvaluates: PermissionEvaluate | PermissionEvaluate[]) {
    const registerOne = (permissionEvaluate: PermissionEvaluate) => {
      // check to make sure we're not accidentally overwriting a permissionEvaluate
      if (
        this._permissionEvaluateMap.has(permissionEvaluate.action) &&
        this._permissionEvaluateMap.get(permissionEvaluate.action) !== permissionEvaluate
      ) {
        throw new Error(
          `Attempted to overwrite an existing permissionEvaluate ${permissionEvaluate.action}.`,
        );
      }

      this._permissionEvaluateMap.set(permissionEvaluate.action, permissionEvaluate);

      // if the permission eval has fallbacks, register that one too
      if (Array.isArray(permissionEvaluate.fallbacks))
        permissionEvaluate.fallbacks.forEach(registerOne);
    };

    if (Array.isArray(permissionEvaluates)) permissionEvaluates.forEach(registerOne);
    else registerOne(permissionEvaluates);
  }

  public evaluate(
    action: string,
    perms: Permission | Permission[],
    context?: unknown,
    maxFallbacks = DEFAULT_MAX_FALLBACKS,
  ): PermissionEvaluateResult {
    // evaluate a single permission
    const evaluatePermission: (
      permission: Permission,
      nextPermissionEvaluate?: PermissionEvaluate,
      ttl?: number,

      // we return the final ttl in the tuple so that we can
      // use it to determine how many fallbacks
      // were evaluated before returning a result
      // and use that info to determine which
      // result to return when evaluating multiple perms
      // if the user has specified the `fallback-depth` strategy
    ) => [PermissionEvaluateResult, number] = (
      permission,
      nextPermissionEvaluate,
      ttl = DEFAULT_MAX_FALLBACKS,
    ) => {
      const currentPermissionEvaluate: PermissionEvaluate | undefined =
        // if we're recursing, use the permissionEvaluate we were given
        nextPermissionEvaluate ||
        // if the user registered a permissionEvaluate for this action, we'll use it
        this._permissionEvaluateMap.get(action) ||
        // if the user didn't register a permissionEvaluate for this action, we'll use a default one
        // that simply checks if the action matches the permission eval's action
        permissionEvaluate(action);

      // base case: if we've reached the end of the fallback chain,
      // return the default result.
      // also, if we've reached the max number of fallbacks, return the default result
      if (!currentPermissionEvaluate || ttl === 0) return [DEFAULT_RESULT, ttl];

      // match up the permission's action with the current permissionEvaluate's action
      if (permission.action === currentPermissionEvaluate.action) {
        // and check if the permission triggers an explicit grant or denial of permission
        const result = currentPermissionEvaluate.hasPermission
          ? currentPermissionEvaluate.hasPermission(permission, context)
          : defaultHasPermissionFunc(permission);

        if (result.result !== 'undetermined') {
          return [result, ttl];
        }
      }

      // if the permission doesn't satisfy the current permissionEvaluate, check the fallbacks
      if (Array.isArray(currentPermissionEvaluate.fallbacks))
        for (const fallback of currentPermissionEvaluate.fallbacks) {
          const [result, finalTtl] = evaluatePermission(permission, fallback, ttl - 1);
          if (result.result !== 'undetermined') {
            return [result, finalTtl];
          }
        }

      return [DEFAULT_RESULT, ttl];
    };

    // if we're given a list of perms, only one has to grant/deny permission;
    if (Array.isArray(perms)) {
      if (this._permRankStrategy === 'evaluate-order') {
        for (const permission of perms) {
          const [result] = evaluatePermission(permission, undefined, maxFallbacks);
          if (result.result !== 'undetermined') {
            return result;
          }
        }
        return DEFAULT_RESULT;
      } else if (this._permRankStrategy === 'fallback-depth') {
        const [result] = perms
          // evaluate each permission
          .map((permission) => evaluatePermission(permission, undefined, maxFallbacks))
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
      const [result] = evaluatePermission(perms, undefined, maxFallbacks);
      return result;
    }
  }
}
