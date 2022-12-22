import { Icon, React, useEffect, useRef, useStyleSheet } from "../../../deps.ts";
import { useDialog } from "../dialog-container/dialog-service.ts";
import FocusTrap from "../../focus-trap/focus-trap.tsx";
import styleSheet from "./dialog.scss.js";

const HEADER_STYLES = {
  default: {
    "--background": "transparent",
    "--text-color": "var(--mm-color-text-bg-secondary)",
    "--border-color": "var(--mm-color-primary)",
  },
  primary: {
    "--background": "var(--mm-color-primary)",
    "--text-color": "var(--mm-color-text-primary)",
    "--border-color": "var(--mm-color-text-primary)",
  },
  secondary: {
    "--background": "var(--mm-color-secondary)",
    "--text-color": "var(--mm-color-text-secondary)",
    "--border-color": "var(--mm-color-text-secondary)",
  },
  gradient: {
    "--background": "var(--mm-gradient)",
    "--text-color": "var(--mm-color-text-gradient)",
    "--border-color": "var(--mm-color-text-gradient)",
  },
};

export default function Dialog({
  showClose = true,
  showBack = false,
  actions,
  alignActions = "fill",
  children,
  onClose,
  onBack,
  className = "",
  dialogCss,
  headerStyle = "default",
  headerText,
}: {
  showClose?: boolean;
  showBack?: boolean;
  actions?: any[];
  alignActions?: "fill" | "left" | "right";
  children?: React.ReactNode;
  onClose?: () => void;
  onBack?: () => void;
  className?: string;
  dialogCss?: React.CSSProperties;
  headerStyle?: keyof typeof HEADER_STYLES;
  headerText?: React.ReactNode;
}) {
  const $$closeIconRef = useRef<HTMLDivElement>(null);
  useStyleSheet(styleSheet);
  const { popDialog } = useDialog();

  const defaultCloseHandler = () => popDialog();
  const defaultBackHandler = () => popDialog();

  const hasTopActions = showClose || showBack;

  const selectedStyles = HEADER_STYLES[headerStyle];

  const handleKeyPress = (ev: React.KeyboardEvent) => {
    if (ev.key === "Escape") {
      ev.stopPropagation();
      popDialog();
    } else if (ev.key === "Enter") {
      popDialog();
    }
  };

  const globalEscapeHandler = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") {
      ev.stopPropagation();
      popDialog();
    }
  };
  useEffect(() => {
    if ($$closeIconRef?.current) {
      $$closeIconRef?.current.focus();
    }

    document.addEventListener("keydown", globalEscapeHandler, false);

    return () => {
      document.removeEventListener("keydown", globalEscapeHandler, false);
    };
  }, []);

  return (
    <FocusTrap>
      <div className={`c-dialog ${className}`} style={dialogCss}>
        <div className="flex">
          {hasTopActions && (
            <div className="top-actions" style={selectedStyles}>
              <div className="left">
                {showBack && (
                  <Icon
                    icon="back"
                    color={selectedStyles["--text-color"]}
                    onclick={onBack ?? defaultBackHandler}
                  />
                )}
                <div className="mm-text-subtitle-1">{headerText}</div>
              </div>
              <div className="right">
                {showClose && (
                  <div
                    className="close"
                    onKeyDown={handleKeyPress}
                    tabIndex={0}
                    ref={$$closeIconRef}
                  >
                    <Icon
                      icon="close"
                      color={selectedStyles["--text-color"]}
                      onclick={onClose ?? defaultCloseHandler}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="content">{children}</div>
          {actions && <div className={`bottom-actions ${alignActions}`}>{actions}</div>}
        </div>
      </div>
    </FocusTrap>
  );
}
