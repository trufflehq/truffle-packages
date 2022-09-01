import { React, useState, useStyleSheet } from "../../deps.ts";
import styleSheet from "./button.scss.js";

type Styles = Record<string, string>;

const buttonStyles: Record<string, Styles> = {
  primary: {
    "--background": "var(--mm-color-primary)",
    "--text-color": "var(--mm-color-text-primary)",
    "--border-color": "var(--mm-color-secondary)",
  },
  secondary: {
    "--background": "var(--mm-color-secondary)",
    "--text-color": "var(--mm-color-text-secondary)",
    "--border-color": "var(--mm-color-primary)",
  },
  gradient: {
    "--background": "var(--mm-gradient)",
    "--text-color": "var(--mm-color-text-gradient)",
    "--border-color": "transparent",
  },
  error: {
    "--background": "var(--mm-color-error)",
    "--text-color": "var(--mm-color-text-error)",
    "--border-color": "var(--mm-color-primary)",
  },
  positive: {
    "--background": "var(--mm-color-positive)",
    "--text-color": "var(--mm-color-text-positive)",
    "--border-color": "var(--mm-color-primary)",
  },
  "bg-primary": {
    "--background": "var(--mm-color-bg-primary)",
    "--text-color": "var(--mm-color-text-bg-primary)",
    "--border-color": "var(--mm-color-primary)",
  },
  "bg-secondary": {
    "--background": "var(--mm-color-bg-secondary)",
    "--text-color": "var(--mm-color-text-bg-secondary)",
    "--border-color": "var(--mm-color-primary)",
  },
  "bg-tertiary": {
    "--background": "var(--mm-color-bg-tertiary)",
    "--text-color": "var(--mm-color-text-bg-tertiary)",
    "--border-color": "var(--mm-color-primary)",
  },
  undefined: {},
};

const sizeStyles = {
  small: {
    "--padding": "8px 16px",
    "--font-size": "12px",
    "--font-weight": "500",
  },
  normal: {
    "--padding": "10px 20px",
    "--font-size": "14px",
    "--font-weight": "600",
  },
};

export default function Button({
  className,
  children = "Click me",
  shouldHandleLoading = false,
  style = "bg-secondary",
  border = false,
  isDisabled = false,
  onClick = () => null,
  size = "normal",
}: {
  className?: string;
  children?: React.ReactNode;
  shouldHandleLoading?: boolean;
  style?: keyof typeof buttonStyles | Styles;
  border?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  size?: keyof typeof sizeStyles;
}) {
  useStyleSheet(styleSheet);
  const [isLoading, setIsLoading] = useState(false);
  const _isDisabled = isDisabled || (shouldHandleLoading && isLoading);

  const clickHandler = async () => {
    if (_isDisabled) return;

    if (shouldHandleLoading) {
      setIsLoading(true);
    }

    await onClick();

    if (shouldHandleLoading) {
      setIsLoading(false);
    }
  };

  const styles: Styles = {
    ...(typeof style === "string" ? buttonStyles[style] : style),
    ...sizeStyles[size],
  };

  if (border) styles["--border-color"] = "rgb(255, 255, 255, 0.16)";

  return (
    <button
      disabled={_isDisabled}
      tabIndex={_isDisabled ? -1 : 0}
      className={`c-button ${className}`}
      onChange={clickHandler}
      onClick={clickHandler}
      style={styles}
    >
      {isLoading ? "Loading" : children}
    </button>
  );
}
