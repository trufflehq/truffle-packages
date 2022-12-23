import { Icon, React, useEffect, useRef, useStyleSheet } from "../../../deps.ts";
import styleSheet from "./menu-item.scss.js";

// used in the settings page
export default function MenuItem({
  icon,
  children,
  onClick,
  onBack,
}: {
  icon?: string;
  children?: any;
  onClick?: () => void;
  onBack?: () => void;
}) {
  useStyleSheet(styleSheet);
  const handleKeyPress = (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter" || ev.key === "ArrowRight") {
      onClick?.();
    } else if (ev.key === "Escape" || ev.key === "ArrowLeft") {
      onBack?.();
    }
  };

  return (
    <div
      className="c-menu-item"
      tabIndex={0}
      onKeyDown={handleKeyPress}
      onClick={onClick ?? (() => null)}
    >
      <div className="left">
        <div className="icon">
          <Icon icon={icon} size="20px" />
        </div>
        <div className="title mm-text-subtitle-1">{children}</div>
      </div>
      <div className="right">
        <Icon icon="chevronRight" size="20px" />
      </div>
    </div>
  );
}
