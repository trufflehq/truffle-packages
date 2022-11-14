import { Observable, React, useComputed, useStyleSheet } from "../../deps.ts";
import { Alert } from "../../shared/types/alert.ts";
import Action from "../action/action.tsx";
import styleSheet from "./recent-actions.scss.js";
import { Action as ActionInterface } from "../../shared/types/action.ts";
import { extractAction } from "../../shared/util/extract-action.ts";

const HIGHLIGHT_RECENT_ACTION_SECONDS = 8;

export default function RecentActions(
  { alerts$ }: { alerts$: Observable<Alert<ActionInterface>[]> },
): JSX.Element {
  useStyleSheet(styleSheet);

  const firstAlert$ = useComputed(() => alerts$.get()?.[0]);
  const firstAlertState$ = useComputed(() =>
    isNSecondsOld(firstAlert$.get(), HIGHLIGHT_RECENT_ACTION_SECONDS)
      ? "last-redeemed"
      : "recently-redeemed"
  );
  const otherAlerts$ = useComputed(() => alerts$.get()?.slice(1, 3));

  return (
    <div className="c-recent-actions">
      <div className="header">Most recent actions</div>
      <div className="actions-list">
        {firstAlert$.get() &&
          (
            <Action
              mode="recent"
              state={firstAlertState$.get()}
              action={extractAction(firstAlert$.get())}
            />
          )}
        {otherAlerts$.get()?.map((alert) => (
          <Action
            mode="recent"
            state="normal"
            action={extractAction(alert)}
          />
        ))}
        {}
      </div>
    </div>
  );
}

function isNSecondsOld(alert: Alert<unknown>, ageSeconds: number) {
  return new Date(alert.time).getTime() < (Date.now() - ageSeconds * 1000);
}
