import { React, useStyleSheet } from "../../../deps.ts";

export default function LinkButton({
  children,
  onClick,
  className,
}: {
  children?: any;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`mm-text-link ${className}`}
      onClick={() => onClick?.()}
    >
      {children}
    </div>
  );
}
