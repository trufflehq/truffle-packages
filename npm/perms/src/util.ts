import { Perm } from './perm';
import { PermEvalFunc, PermEval, PermEvalResult } from './perm-eval';

export const defaultResult: PermEvalResult = {
  result: 'undetermined',
  reason: `Nothing explicitly granted or denied permission.`,
  reasonCode: 'undetermined',
};

function defaultHasPermissionFunc(perm: Perm): PermEvalResult {
  switch (perm.value) {
    case 'allow':
      return {
        result: 'granted',
        reason: `Permission explicitly granted.`,
        reasonCode: 'granted',
      };

    case 'deny':
      return {
        result: 'denied',
        reason: `Permission explicitly denied.`,
        reasonCode: 'denied',
      };

    default:
      return defaultResult;
  }
}

export function perm(perm: Perm): Perm;
export function perm(action: string, params?: any): Perm;
export function perm(permOrAction: string | Perm, params?: any): Perm {
  if (typeof permOrAction === 'string') {
    return {
      action: permOrAction,
      value: 'allow',
      params,
    };
  } else {
    return permOrAction;
  }
}

export function permEval(
  permEval:
    | string
    | {
        action: string;
        hasPermission?: PermEvalFunc;
        fallbacks?: PermEval[];
      }
): PermEval {
  if (typeof permEval === 'string') {
    return {
      action: permEval,
      hasPermission: defaultHasPermissionFunc,
    };
  }

  return {
    hasPermission: defaultHasPermissionFunc,
    ...permEval,
  };
}

export function permEvalChain(permEvalChain: PermEval[]) {
  return permEvalChain.reduceRight((prev, curr) => ({
    ...curr,
    fallbacks: [prev],
  }));
}

export interface PermEvalTreeNode {
  self: PermEval;
  children?: PermEvalTreeNode[];
}

export function permEvalTree(node: PermEvalTreeNode): PermEval[] {
  const { self, children } = node;

  // if this is a leaf node, just return array with itself
  if (!children) {
    return [self];
  }

  return children.reduce<PermEval[]>((acc, child) => {
    // link the child to its parent
    child.self.fallbacks = [self];

    // add the leaf nodes from this child to our final array
    return acc.concat(permEvalTree(child));
  }, []);
}
