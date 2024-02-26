import { Permission } from "./permission";
import {
  PermissionEvaluate,
  PermissionEvaluateFunc,
  PermissionEvaluateResult,
  PermissionEvaluateTreeBuilderNode,
} from "./permission-evaluate";

export const DEFAULT_RESULT: PermissionEvaluateResult = {
  result: "undetermined",
  reason: `Nothing explicitly granted or denied permission.`,
  reasonCode: "undetermined",
};

export function defaultHasPermissionFunc(permission: Permission): PermissionEvaluateResult {
  switch (permission.value) {
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

export function permission(permission: Permission): Permission;
export function permission(action: string, params?: any): Permission;
export function permission(permOrAction: string | Permission, params?: any): Permission {
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

export function permissionEvaluate(
  permissionEvaluate:
    | string
    | {
      action: string;
      hasPermission?: PermissionEvaluateFunc;
      fallbacks?: PermissionEvaluate[];
    },
): PermissionEvaluate {
  if (typeof permissionEvaluate === "string") {
    return {
      action: permissionEvaluate,
    };
  }

  return permissionEvaluate;
}

export function permissionEvaluateChain(permissionEvaluateChain: PermissionEvaluate[]) {
  return permissionEvaluateChain.reduceRight((prev, curr) => ({
    ...curr,
    fallbacks: [prev],
  }));
}

export function permissionEvaluateTree(node: PermissionEvaluateTreeBuilderNode): PermissionEvaluate[] {
  const { self, children } = node;

  // if this is a leaf node, just return array with itself
  if (!children) {
    return [self];
  }

  return children
    .reduce<PermissionEvaluate[]>((acc, child) => {
      // link the child to its parent
      child.self.fallbacks = [self];

      // add the leaf nodes from this child to our final array
      return acc.concat(permissionEvaluateTree(child));
    }, [])
    .concat(self);
}

export function getBuilderTreeNode(
  action: string,
  root: PermissionEvaluateTreeBuilderNode,
): PermissionEvaluateTreeBuilderNode | null {
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
  root: PermissionEvaluateTreeBuilderNode,
  ...toAdd: PermissionEvaluateTreeBuilderNode[]
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

export const permissionEvaluateFunc: PermissionEvaluateFunc = (permission, context = {}) => {
  // check if they have permission to access any object
  if (permission.params?.all) {
    return permission.value === "allow"
      ? {
        result: "granted",
        reason: `Permission granted to ${permission.action} all rows.`,
        reasonCode: "granted",
      }
      : {
        result: "denied",
        reason: `Permission denied to ${permission.action} all rows.`,
        reasonCode: "denied",
      };
  }

  const isValidMatchObject = permission.params?.match &&
    Object.keys(permission.params.match).length > 0;
  const allParamsMatchInContext = isValidMatchObject &&
    isSubsetOfSuperset(permission.params.match, context);

  if (allParamsMatchInContext) {
    return permission.value === "allow"
      ? {
        result: "granted",
        reason: `Permission granted to ${permission.action} with params ${
          JSON.stringify(permission.params)
        }`,
        reasonCode: "granted",
      }
      : {
        result: "denied",
        reason: `Permission denied to ${permission.action} with params ${
          JSON.stringify(permission.params)
        }`,
        reasonCode: "denied",
      };
  }

  return {
    result: "undetermined",
    reason:
      `Nothing explicitly granted or denied permission to ${permission.action} with params ${
        JSON.stringify(permission.params)
      }`,
  };
};

export const BasicModelPermissionEvaluateBuilderTree = (domain?: string) => {
  const actionName = (action: string) => {
    return domain ? `${domain}.${action}` : action;
  };

  return {
    self: permissionEvaluate(actionName("all")),
    children: [
      {
        self: permissionEvaluate(actionName("list")),
        children: [{ self: permissionEvaluate(actionName("read")) }],
      },
      {
        self: permissionEvaluate(actionName("write")),
        children: [
          { self: permissionEvaluate(actionName("create")) },
          { self: permissionEvaluate(actionName("update")) },
          { self: permissionEvaluate(actionName("delete")) },
        ],
      },
      { self: permissionEvaluate(actionName("execute")) },
    ],
  };
};
