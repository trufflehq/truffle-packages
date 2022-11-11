import ActionHistory from "../../../components/action-history/action-history.tsx";
import RecentActions from "../../../components/recent-actions/recent-actions.tsx";
import { enableLegendStateReact, React, toDist, useStyleSheet } from "../../../deps.ts";
import { useLiveAlertConnection } from "../../../shared/hooks/use-live-alert-connection.ts";
import styleSheet from "./page.scss.js";

enableLegendStateReact();

function DoSomethingAdminPage() {
  useStyleSheet(styleSheet);
  const { alerts$ } = useLiveAlertConnection();
  return (
    <div className="c-do-something-admin-page">
      <div>
        {JSON.stringify(alerts$.get())}
      </div>
      <div className="container">
        <div className="page-title">Actions</div>
        <RecentActions />
        <ActionHistory />
      </div>
    </div>
  );
}

export default toDist(DoSomethingAdminPage, import.meta.url);
