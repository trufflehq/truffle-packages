import { _, React, useStyleSheet } from "../../deps.ts";
import stylesheet from "./error-renderer.scss.js";
export default function ErrorRenderer({ message }: { message?: string }) {
  useStyleSheet(stylesheet);

  return (
    <div className="c-error">
      <div className="inner">
        {message}
      </div>
    </div>
  );
}
