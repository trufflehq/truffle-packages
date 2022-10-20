// https://github.com/bitovi/react-to-webcomponent
// https://github.com/bitovi/react-to-webcomponent/blob/master/LICENSE
const renderSymbol = Symbol.for("r2wc.reactRender");
const shouldRenderSymbol = Symbol.for("r2wc.shouldRender");
const rootSymbol = Symbol.for("r2wc.root");
const isKilledSymbol = Symbol.for("r2wc.isKilled");

function toDashedStyle(camelCase = "") {
  return camelCase.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function toCamelCaseStyle(dashedStyle = "") {
  return dashedStyle.replace(/-([a-z0-9])/g, function (g) {
    return g[1].toUpperCase();
  });
}

const define = {
  // Creates a getter/setter that re-renders everytime a property is set.
  expando: function (receiver, key, value) {
    Object.defineProperty(receiver, key, {
      enumerable: true,
      get: function () {
        return value;
      },
      set: function (newValue) {
        value = newValue;
        this[renderSymbol]();
      },
    });
    receiver[renderSymbol]();
  },
};

function isAllCaps(word) {
  return word.split("").every((c) => c.toUpperCase() === c);
}

function flattenIfOne(arr) {
  if (!Array.isArray(arr)) {
    return arr;
  }
  if (arr.length === 1) {
    return arr[0];
  } else if (arr.length === 0) {
    return undefined;
  }
  return arr;
}

function mapChildren(React, node, options) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.toString();
  }

  return flattenIfOne(
    Array.from(node.childNodes).map((c) => {
      if (c.nodeType === Node.TEXT_NODE) {
        return c.textContent.toString();
      }
      // BR = br, ReactElement = ReactElement
      var nodeName = isAllCaps(c.nodeName)
        ? c.nodeName.toLowerCase()
        : c.nodeName;
      var children = flattenIfOne(mapChildren(React, c, options));

      let element = React.createElement(nodeName, c.attributes, children);

      // VERY IMPORTANT!
      // if the child is a web component that was created with this (react-to-web-component),
      // it's going to get created again. so we want to prevent the child from actually creating itself
      // in the lightdom, and only create itself in the shadowdom.
      // otherwise we'll have multiple reacts going at once for the same thing.
      // and multiple useEffects being called, with some not being cleaned up at all.
      // so multiple window event listeners, etc... if useEffects do that.
      // since mapChildren is called before the actual dom mounting, we can effectively stop it
      // before it creates the react instance for the lightdom version by setting a flag
      if (c.disconnectedCallback) {
        c[isKilledSymbol] = true;

        // we still need to make sure we set context so useStylsheet has access to the
        // web component node to apply the styles to
        if (options.wcContainerContext) {
          element = React.createElement(
            options.wcContainerContext.Provider,
            { value: { container: c } },
            element,
          );
        }
      }

      return element;
    }),
  );
}

/**
 * Converts a React component into a webcomponent by wrapping it in a Proxy object.
 * @param {ReactComponent}
 * @param {React}
 * @param {ReactDOM}
 * @param {Object} options - Optional parameters
 * @param {String?} options.shadow - Use shadow DOM rather than light DOM.
 * @param {String?} options.dashStyleAttributes - Use dashed style of attributes to reflect camelCase properties
 * @param {String?} options.reactContainerContext - context for getting root element shadowRoot
 */
export default function (ReactComponent, React, ReactDOM, options = {}) {
  const renderAddedProperties = {
    isConnected: "isConnected" in HTMLElement.prototype,
  };
  let rendering = false;
  // Create the web component "class"
  const WebComponent = function () {
    const self = Reflect.construct(HTMLElement, arguments, this.constructor);
    if (options.shadow) {
      self.attachShadow({ mode: "open" });
    }
    return self;
  };

  // Make the class extend HTMLElement
  const targetPrototype = Object.create(HTMLElement.prototype);
  targetPrototype.constructor = WebComponent;

  // But have that prototype be wrapped in a proxy.
  const proxyPrototype = new Proxy(targetPrototype, {
    has: function (target, key) {
      return key in (ReactComponent.propTypes || {}) ||
        key in targetPrototype;
    },

    // when any undefined property is set, create a getter/setter that re-renders
    set: function (target, key, value, receiver) {
      // react seems to add __reactFiber and __reactProps, which cause errors
      // when attempting to unmount component
      if (key.startsWith?.("__react")) {
        return true;
      }

      if (rendering) {
        renderAddedProperties[key] = true;
      }

      if (
        typeof key === "symbol" || renderAddedProperties[key] || key in target
      ) {
        return Reflect.set(target, key, value, receiver);
      } else {
        define.expando(receiver, key, value);
      }
      return true;
    },
    // makes sure the property looks writable
    getOwnPropertyDescriptor: function (target, key) {
      const own = Reflect.getOwnPropertyDescriptor(target, key);
      if (own) {
        return own;
      }
      if (key in ReactComponent.propTypes) {
        return {
          configurable: true,
          enumerable: true,
          writable: true,
          value: undefined,
        };
      }
    },
  });
  WebComponent.prototype = proxyPrototype;

  // Setup lifecycle methods
  targetPrototype.connectedCallback = function () {
    // Once connected, it will keep updating the innerHTML.
    // We could add a render method to allow this as well.
    this[shouldRenderSymbol] = true;
    this[renderSymbol]();
  };
  targetPrototype.disconnectedCallback = function () {
    if (typeof ReactDOM.createRoot === "function") {
      this[rootSymbol]?.unmount();
    } else {
      ReactDOM.unmountComponentAtNode(this);
    }
  };
  targetPrototype[renderSymbol] = function () {
    if (this[isKilledSymbol]) {
      return;
    }

    if (this[shouldRenderSymbol] === true) {
      const data = {};
      Object.keys(this).forEach(function (key) {
        if (renderAddedProperties[key] !== false) {
          data[key] = this[key];
        }
      }, this);
      rendering = true;
      // Container is either shadow DOM or light DOM depending on `shadow` option.
      const container = options.shadow ? this.shadowRoot : this;

      // Array.from(this.attributes).forEach(function (attr) {
      //   data[attr.name] = attr.nodeValue;
      // });
      const children = flattenIfOne(mapChildren(React, this, options));

      let element = React.createElement(ReactComponent, data, children);

      if (options.wcContainerContext) {
        element = React.createElement(
          options.wcContainerContext.Provider,
          { value: { container } },
          element,
        );
      }

      // Use react to render element in container
      if (typeof ReactDOM.createRoot === "function") {
        // FIXME? w/o true, routing breaks "Cannot update an unmounted root."
        if (!this[rootSymbol] || true) {
          this[rootSymbol] = ReactDOM.createRoot(container);
        }

        this[rootSymbol].render(element);
      } else {
        ReactDOM.render(element, container);
      }

      rendering = false;
    }
  };

  // Handle attributes changing
  if (ReactComponent.propTypes) {
    WebComponent.observedAttributes = options.dashStyleAttributes
      ? Object.keys(ReactComponent.propTypes).map(function (key) {
        return toDashedStyle(key);
      })
      : Object.keys(ReactComponent.propTypes);
    targetPrototype.attributeChangedCallback = function (
      name,
      oldValue,
      newValue,
    ) {
      // TODO: handle type conversion
      const propertyName = options.dashStyleAttributes
        ? toCamelCaseStyle(name)
        : name;
      this[propertyName] = newValue;
    };
  }

  return WebComponent;
}
