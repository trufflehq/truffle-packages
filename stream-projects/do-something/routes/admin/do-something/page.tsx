import ActionHistory from "../../../components/action-history/action-history.tsx";
import RecentActions from "../../../components/recent-actions/recent-actions.tsx";
import { React, toDist, useStyleSheet } from "../../../deps.ts";
import styleSheet from "./page.scss.js";

function DoSomethingAdminPage() {
  useStyleSheet(styleSheet);
  return (
    <div className="c-do-something-admin-page">
      <div className="container">
        <div className="page-title">Actions</div>
        <RecentActions />
        <ActionHistory />
      </div>
    </div>
  );
}

export default toDist(DoSomethingAdminPage, import.meta.url);
