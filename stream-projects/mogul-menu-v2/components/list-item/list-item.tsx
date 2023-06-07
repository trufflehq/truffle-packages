import { classKebab, Icon, React, useStyleSheet } from "../../deps.ts";
import stylesheet from "./list-item.scss.js";

export default function ListItem(
  { className, icon, iconViewBox = 24, color, children, onClick }: {
    className?: string;
    icon: string;
    iconViewBox?: number;
    color: string;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
  },
) {
  useStyleSheet(stylesheet);
  return (
    <div
      className={`c-list-item ${className ?? ""} ${
        classKebab({ isClickable: !!onClick })
      }`}
      onClick={onClick}
    >
      <div
        className="icon"
        style={{
          border: `1px solid ${color}`,
        }}
      >
        <Icon icon={icon} color={color} size="40px" viewBox={iconViewBox} />
      </div>
      <div className="body">
        {children}
      </div>
      {onClick && (
        <div className="continue">
          <Icon icon="chevronRight" size={24} />
        </div>
      )}
    </div>
  );
}
