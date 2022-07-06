import React, { useEffect, useMemo, useRef } from "https://npm.tfl.dev/react";
import { createPortal } from "https://npm.tfl.dev/react-dom";

// inspired by https://github.com/Wildhoney/ReactShadow and https://github.com/httptoolkit/react-reverse-portal
// this creates a custom dom element, attaches it to the react dom in useEffect, then portals the react children
// into the shadowroot.

// https://github.com/Wildhoney/ReactShadow is good, but passing when refs into any child element,
// they aren't available in the useEffect, only after the useEffect. this is because react-shadow
// waits until useEffect() (when it has a dom node from its own useRef) to create the shadowroot,
// then renders again and renders a portal into the shadowroot
const Isolate = React.forwardRef(
  ({ children, element = "div", ...props }, ref) => {
    // FIXME: ssr won't have scoped stylesheets...
    // could try declarative shadow dom/root again? the problem with that is
    // react seems to nuke the shadow root and replace back with <template ... />
    // may be fixed in 19?
    // https://github.com/facebook/react/issues/11347#issuecomment-988970952
    // https://github.com/testing-library/dom-testing-library/issues/413#issuecomment-1018772952
    // https://twitter.com/claviska/status/1508849456908746767
    // https://codesandbox.io/s/adoring-breeze-jrewu?file=/src/App.js
    // i tried react 19 experimental in june 2022, and it was still broken.
    // useEffect on the template rel doesn't have a shadowRoute property

    if (typeof document === "undefined") return <isolate-wrapper><isolate>{children}</isolate></isolate-wrapper>;

    const isolateRef = useRef();

    const { root, domEl } = useMemo(() => {
      const domEl = document.createElement("isolate-web-component");
      const root = domEl.attachShadow({ mode: "open" });
      return { root, domEl };
    }, []);

    useEffect(() => {
      isolateRef.current.appendChild(domEl);
    }, []);

    return <isolate-wrapper ref={isolateRef}>{createPortal(children, root)}</isolate-wrapper>;
  },
);

export default Isolate;
