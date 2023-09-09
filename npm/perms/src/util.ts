import { Perm } from "./perm";
import {
  PermEval,
  PermEvalFunc,
  PermEvalResult,
  PermEvalTreeBuilderNode,
} from "./perm-eval";

export const DEFAULT_RESULT: PermEvalResult = {
  result: "undetermined",
  reason: `Nothing explicitly granted or denied permission.`,
  reasonCode: "undetermined",
};

export function defaultHasPermissionFunc(perm: Perm): PermEvalResult {
  switch (perm.value) {
    case "allow":
      return {
        result: "granted",
        reason: `Permission explicitly granted.`,
        reasonCode: "granted",
      };

    case "deny":
      return {
        result: "denied",
        reason: `Permission explicitly denied.`,
        reasonCode: "denied",
      };

    default:
      return DEFAULT_RESULT;
  }
}

export function perm(perm: Perm): Perm;
export function perm(action: string, params?: any): Perm;
export function perm(permOrAction: string | Perm, params?: any): Perm {
  if (typeof permOrAction === "string") {
    return {
      action: permOrAction,
      value: "allow",
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
    },
): PermEval {
  if (typeof permEval === "string") {
    return {
      action: permEval,
    };
  }

  return permEval;
}

export function permEvalChain(permEvalChain: PermEval[]) {
  return permEvalChain.reduceRight((prev, curr) => ({
    ...curr,
    fallbacks: [prev],
  }));
}

export function permEvalTree(node: PermEvalTreeBuilderNode): PermEval[] {
  const { self, children } = node;

  // if this is a leaf node, just return array with itself
  if (!children) {
    return [self];
  }

  return children
    .reduce<PermEval[]>((acc, child) => {
      // link the child to its parent
      child.self.fallbacks = [self];

      // add the leaf nodes from this child to our final array
      return acc.concat(permEvalTree(child));
    }, [])
    .concat(self);
}

export function getBuilderTreeNode(
  action: string,
  root: PermEvalTreeBuilderNode,
): PermEvalTreeBuilderNode | null {
  if (root.self.action === action) {
    return root;
  }

  if (!Array.isArray(root.children)) {
    return null;
  }

  for (const child of root.children) {
    const node = getBuilderTreeNode(action, child);

    if (node) {
      return node;
    }
  }

  return null;
}

export function addBuilderTreeChild(
  action: string,
  root: PermEvalTreeBuilderNode,
  ...toAdd: PermEvalTreeBuilderNode[]
) {
  const node = getBuilderTreeNode(action, root);
  if (!node) return;

  if (!Array.isArray(node.children)) {
    node.children = [];
  }

  node.children.push(...toAdd);
}

// returns true if all keys in subset are in superset
// eg. { a: 1, b: { c: 2 } } is a deep subset of { a: 1, b: { c: 2, d: 3 }, e: 4 }
const isSubsetOfSuperset = (
  subset: Record<string, unknown> = {},
  superset: Record<string, unknown> = {},
): boolean => {
  return Object.keys(subset).every((key) => {
    if (typeof subset[key] === "object") {
      return isSubsetOfSuperset(
        subset[key] as Record<string, unknown>,
        superset[key] as Record<string, unknown>,
      );
    }

    return superset[key] === subset[key];
  });
};

export const permEvalFunc: PermEvalFunc = (perm, context = {}) => {
  // check if they have permission to access any object
  if (perm.params?.all) {
    return perm.value === "allow"
      ? {
        result: "granted",
        reason: `Permission granted to ${perm.action} all rows.`,
        reasonCode: "granted",
      }
      : {
        result: "denied",
        reason: `Permission denied to ${perm.action} all rows.`,
        reasonCode: "denied",
      };
  }

  const allParamsMatchInContext = isSubsetOfSuperset(perm.params, context);

  if (allParamsMatchInContext) {
    return perm.value === "allow"
      ? {
        result: "granted",
        reason: `Permission granted to ${perm.action} with params ${
          JSON.stringify(perm.params)
        }`,
        reasonCode: "granted",
      }
      : {
        result: "denied",
        reason: `Permission denied to ${perm.action} with params ${
          JSON.stringify(perm.params)
        }`,
        reasonCode: "denied",
      };
  }

  return {
    result: "undetermined",
    reason:
      `Nothing explicitly granted or denied permission to ${perm.action} with params ${
        JSON.stringify(perm.params)
      }`,
  };
};

export const BasicModelPermEvalBuilderTree = (domain?: string) => {
  const actionName = (action: string) => {
    return domain ? `${domain}.${action}` : action;
  };

  return {
    self: permEval(actionName("all")),
    children: [
      {
        self: permEval(actionName("list")),
        children: [{ self: permEval(actionName("read")) }],
      },
      {
        self: permEval(actionName("write")),
        children: [
          { self: permEval(actionName("create")) },
          { self: permEval(actionName("update")) },
          { self: permEval(actionName("delete")) },
        ],
      },
      { self: permEval(actionName("execute")) },
    ],
  };
};
