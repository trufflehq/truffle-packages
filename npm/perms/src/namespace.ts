import { PermEval, PermEvalFunc } from './perm-eval';
import { buildModelMatcher } from './util';

interface PermDomainOptions {
  defaultPermEvalFunc?: PermEvalFunc;
}

export class PermNamespace {
  private _actions = new Map<string, PermEval>();
  private _children = new Set<PermNamespace>();

  private _defaultPermEvalFunc: PermEvalFunc;

  constructor(
    public name: string,
    options: PermDomainOptions = {},
  ) {
    this._defaultPermEvalFunc =
      options.defaultPermEvalFunc ?? buildModelMatcher(this.name);
  }

  public registerAction(permEval: PermEval) {
    // don't register the same action twice
    if (this._actions.has(permEval.action)) return;

    const newPermEval: PermEval = {
      // default to the defaultPermEvalFunc
      hasPermission: this._defaultPermEvalFunc,

      // get all the other properties from the permEval
      ...permEval,

      // add the domain name to the action
      action: `${this.name}.${permEval.action}`,
    };

    this._actions.set(permEval.action, newPermEval);
  }

  public registerActions(permEvals: PermEval[]) {
    permEvals.forEach((permEval) => this.registerAction(permEval));

    // replace fallbacks with the new permEvals we created in registerAction
    permEvals.forEach((permEval) => {
      if (Array.isArray(permEval.fallbacks)) {
        const newPermEval = this._actions.get(permEval.action)!;
        newPermEval.fallbacks = permEval.fallbacks.map((fallback) => {
          return this._actions.get(fallback.action)!;
        });
      }
    });
  }

  public registerChild(child: PermNamespace) {
    this._children.add(child);
  }

  public registerChildren(children: PermNamespace[]) {
    children.forEach((child) => this.registerChild(child));
  }

  private _linkActions(stack: PermNamespace[]) {
    for (const [action, permEval] of this._actions.entries()) {
      // go up the stack and link this action to the first domain that has a matching action
      for (const domain of stack) {
        if (domain._actions.has(action)) {
          permEval.fallbacks ??= [];
          permEval.fallbacks.push(domain._actions.get(action)!);
          break;
        }
      }
    }
  }

  private _recurseDomain(
    // we'll pass down the stack
    // and modify it in place so that
    // we're not creating a bunch of arrays
    stack: PermNamespace[],

    // same with the result tree
    resultTree: PermEval[],
  ): PermEval[] {
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

  public generatePermGraph(): PermEval[] {
    return this._recurseDomain([], []);
  }
}
