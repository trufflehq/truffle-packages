import { React, Link, toDist, useStyleSheet } from "../../deps.ts";
import styleSheet from "./page.css.ts";
function AdminPage() {
  useStyleSheet(styleSheet);
  return (
    <div className="p-admin-page">
      <Link href="/admin/form-setup">Form setup</Link>
      <Link href="/admin/responses">Responses</Link>
      <Link href="/">Fill out form</Link>
    </div>
  );
}

export default toDist(AdminPage, import.meta.url);
