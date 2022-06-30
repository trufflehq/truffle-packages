import React from "https://npm.tfl.dev/react";
import PropTypes from "https://npm.tfl.dev/prop-types@15";
import * as DialogPrimitive from "https://npm.tfl.dev/@radix-ui/react-dialog@0";
import useObservables from "https://tfl.dev/@truffle/utils@0.0.1/obs/use-observables.js";

import { useThemeContext } from "../theme/theme-context.js";
import Icon from "../icon/icon.jsx";
import Isolate from "../isolate/isolate.tsx";
import Stylesheet from "../stylesheet/stylesheet.jsx";

export default function Dialog(props) {
  const themeContext = useThemeContext();
  const Dialog = themeContext.components?.dialog.Component || BaseDialog;
  return <Dialog {...props} />;
}

function BaseDialog(props) {
  const {
    isOpen,
    onClose,
    title,
    description,
    content,
  } = props;

  const themeContext = useThemeContext();

  const close = () => {
    onClose?.();
  };

  const cssUrl = themeContext.components?.dialog.cssUrl ||
    new URL("./dialog.css", import.meta.url);

  return (
    <DialogPrimitive.Root open={isOpen}>
      <DialogPrimitive.Portal>
        <Isolate>
          <Stylesheet url={cssUrl} />
          <DialogPrimitive.Overlay className="overlay" onClick={close} />
          <DialogPrimitive.Content
            className="content"
            onEscapeKeyDown={close}
          >
            {title && (
              <DialogPrimitive.Title className="title">
                {title}
              </DialogPrimitive.Title>
            )}
            {description && (
              <DialogPrimitive.Description className="description">
                {description}
              </DialogPrimitive.Description>
            )}
            <div className="inner-content">{content}</div>
            <DialogPrimitive.Close className="close" onClick={close}>
              <Icon icon="close" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </Isolate>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

BaseDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
};

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
