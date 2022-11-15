import { Observable, React, useComputed, useStyleSheet } from "../../deps.ts";
import { Alert } from "../../shared/types/alert.ts";
import DoSomethingAction from "../do-something-action/do-something-action.tsx";
import styleSheet from "./action-history.scss.js";
import { Action as ActionInterface } from "../../shared/types/action.ts";
import { extractAction } from "../../shared/util/extract-action.ts";

export default function ActionHistory(
  { alerts$ }: { alerts$: Observable<Alert<ActionInterface>[]> },
) {
  useStyleSheet(styleSheet);

  const actions$ = useComputed(() => alerts$.get()?.slice(3).map(extractAction));

  return (
    <div className="c-action-history">
      <div className="header">Action history</div>
      <div className="actions-list">
        {actions$?.get()?.map((action) => <DoSomethingAction mode="normal" action={action} />)}
      </div>
    </div>
  );
}
