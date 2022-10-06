import { React, useState, useStyleSheet } from "../../deps.ts";
import styleSheet from "./button.scss.js";

type Styles = Record<string, string>;

const buttonStyles: Record<string, Styles> = {
  primary: {
    "--background": "#8045E0",
    "--text-color": "#FFFFFF",
    // "--border-color": "",
  },
  secondary: {
    "--background": "#FFFFFF1F",
    "--text-color": "#FFFFFF",
    // "--border-color": "var(--mm-color-primary)",
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
  style = "secondary",
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
