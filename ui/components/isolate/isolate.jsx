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
    // could try declarative shadow root again? the problem with that is
    // it only seems to work on initial page load, not when streamed in vs react streaming/suspense
    if (typeof document === "undefined") return <isolate-wrapper><isolate>{children}</isolate></isolate-wrapper>;

    const isolateRef = useRef();

    const { root, domEl } = useMemo(() => {
      const domEl = document.createElement("isolate-wrapper");
      const root = domEl.attachShadow({ mode: "open" });
      return { root, domEl };
    }, []);

    useEffect(() => {
      isolateRef.current.appendChild(domEl);
    }, []);

    return <isolate ref={isolateRef}>{createPortal(children, root)}</isolate>;
  },
);

export default Isolate;
