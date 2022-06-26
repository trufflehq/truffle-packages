import React from "https://npm.tfl.dev/react";
import * as DialogPrimitive from "https://npm.tfl.dev/@radix-ui/react-dialog";
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";

// TODO: set ThemeContext.Provider in ultra-server/setup.jsx
import { useThemeContext } from "../theme/theme-context.js";
import ScopedStylesheet from "../scoped-stylesheet/scoped-stylesheet.jsx";

export default function Dialog(props) {
  const themeContext = useThemeContext();
  const Dialog = themeContext.components?.dialog.Component || BaseDialog;
  return <Dialog {...props} />;
}

function BaseDialog(props) {
  const themeContext = useThemeContext();

  const {
    isOpen,
    onClose,
    title,
    description,
  } = props;

  const close = () => {
    onClose?.();
  };

  const cssUrl = themeContext.components?.dialog.cssUrl ||
    new URL("./dialog.css", import.meta.url);

  return (
    <DialogPrimitive.Root open={isOpen}>
      <DialogPrimitive.Portal>
        <ScopedStylesheet url={cssUrl}>
          <DialogPrimitive.Overlay className="overlay" onClick={close} />
          <DialogPrimitive.Content
            className="content"
            onEscapeKeyDown={close}
          >
            {title && <DialogPrimitive.Title>{title}</DialogPrimitive.Title>}
            {description && (
              <DialogPrimitive.Description>
                {description}
              </DialogPrimitive.Description>
            )}
            <DialogPrimitive.Close className="close" onClick={close}>
              close
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </ScopedStylesheet>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function Dialog$(props) {
  const { isOpenSubject } = props;

  const { isOpen } = useObservables(() => ({
    isOpen: isOpenSubject.obs,
  }));

  const newProps = {
    isOpen,
    onClose: () => {
      console.log("close...");
      isOpenSubject.next(false);
      props.onClose?.();
    },
  };

  return <Dialog {...props} {...newProps} />;
}
