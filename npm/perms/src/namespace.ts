import { PermissionEvaluate } from "./permission-evaluate";
import { permissionEvaluateFunc } from "./util";

export class PermissionNamespace {
  private _actions = new Map<string, PermissionEvaluate>();
  private _children = new Set<PermissionNamespace>();

  constructor(
    public name: string,
  ) {}

  public registerAction(permissionEvaluate: PermissionEvaluate) {
    // don't register the same action twice
    if (this._actions.has(permissionEvaluate.action)) return;

    const newPermissionEvaluate: PermissionEvaluate = {
      hasPermission: permissionEvaluateFunc,

      // get all the other properties from the permissionEvaluate
      ...permissionEvaluate,

      // add the domain name to the action
      action: `${this.name}.${permissionEvaluate.action}`,
    };

    this._actions.set(permissionEvaluate.action, newPermissionEvaluate);
  }

  public registerActions(permissionEvaluates: PermissionEvaluate[]) {
    permissionEvaluates.forEach((permissionEvaluate) => this.registerAction(permissionEvaluate));

    // replace fallbacks with the new permissionEvaluates we created in registerAction
    permissionEvaluates.forEach((permissionEvaluate) => {
      if (Array.isArray(permissionEvaluate.fallbacks)) {
        const newPermissionEvaluate = this._actions.get(permissionEvaluate.action)!;
        newPermissionEvaluate.fallbacks = permissionEvaluate.fallbacks.map((fallback) => {
          return this._actions.get(fallback.action)!;
        });
      }
    });
  }

  public registerChild(child: PermissionNamespace) {
    this._children.add(child);
  }

  public registerChildren(children: PermissionNamespace[]) {
    children.forEach((child) => this.registerChild(child));
  }

  private _linkActions(stack: PermissionNamespace[]) {
    for (const [action, permissionEvaluate] of this._actions.entries()) {
      // go up the stack and link this action to the first domain that has a matching action
      for (const domain of stack) {
        if (domain._actions.has(action)) {
          permissionEvaluate.fallbacks ??= [];
          permissionEvaluate.fallbacks.push(domain._actions.get(action)!);
          break;
        }
      }
    }
  }

  private _recurseDomain(
    // we'll pass down the stack
    // and modify it in place so that
    // we're not creating a bunch of arrays
    stack: PermissionNamespace[],
    // same with the result tree
    resultTree: PermissionEvaluate[],
  ): PermissionEvaluate[] {
    // link all the actions in this domain to actions in the parent domains
    this._linkActions(stack);

    // add all the actions in this domain to the result tree
    resultTree.push(...this._actions.values());

    // push ourself to the stack
    stack.unshift(this);

    // recurse into the children
    this._children.forEach((child) => child._recurseDomain(stack, resultTree));

    // pop ourself from the stack
    stack.shift();

    return resultTree;
  }

  public generatePermissionGraph(): PermissionEvaluate[] {
    return this._recurseDomain([], []);
  }
}
