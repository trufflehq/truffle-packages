import ActionHistory from "../../../components/action-history/action-history.tsx";
import RecentActions from "../../../components/recent-actions/recent-actions.tsx";
import { enableLegendStateReact, React, toDist, useStyleSheet } from "../../../deps.ts";
import { useAlertConnection } from "../../../shared/hooks/use-alert-connection.ts";
import styleSheet from "./page.scss.js";

enableLegendStateReact();

function DoSomethingAdminPage() {
  useStyleSheet(styleSheet);

  const { alerts$ } = useAlertConnection();

  return (
    <div className="c-do-something-admin-page">
      <div className="container">
        <div className="page-title">Actions</div>
        <RecentActions alerts$={alerts$} />
        <ActionHistory alerts$={alerts$} />
      </div>
    </div>
  );
}

export default toDist(DoSomethingAdminPage, import.meta.url);
