import { enableLegendStateReact, React, useStyleSheet } from "../../deps.ts";
import { useAlerts$ } from "../../shared/hooks/use-alerts.ts";
import ActionHistory from "../action-history/action-history.tsx";
import RecentActions from "../recent-actions/recent-actions.tsx";
import styleSheet from "./admin-page.scss.js";

enableLegendStateReact();

export default function DoSomethingAdminPage() {
  useStyleSheet(styleSheet);

  const alerts$ = useAlerts$();

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
