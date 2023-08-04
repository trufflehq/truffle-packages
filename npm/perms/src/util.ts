import { Perm } from "./perm";
import { PermEvalFunc, PermEval } from "./perm-eval";

export function perm(perm: Perm): Perm;
export function perm(action: string, params?: any): Perm;
export function perm(permOrAction: string | Perm, params?: any): Perm {
  if (typeof permOrAction === "string") {
    return {
      action: permOrAction,
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
        fallback?: PermEval;
      }
): PermEval {
  if (typeof permEval === "string") {
    return {
      action: permEval,
      hasPermission: () => true,
    };
  }

  return {
    hasPermission: () => true,
    ...permEval,
  };
}

export function permEvalChain(permEvalChain: PermEval[]) {
  return permEvalChain.reduceRight((prev, curr) => ({
    ...curr,
    fallback: prev,
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
    child.self.fallback = self;

    // add the leaf nodes from this child to our final array
    return acc.concat(permEvalTree(child));
  }, []);
}
