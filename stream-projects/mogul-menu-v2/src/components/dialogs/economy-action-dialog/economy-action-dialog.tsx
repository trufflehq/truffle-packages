import { _, React, useStyleSheet } from "../../../deps.ts";
import { EconomyAction } from "../../../types/mod.ts";
import Dialog from "../../base/dialog/dialog.tsx";
import styleSheet from "./economy-action-dialog.scss.js";

export default function EconomyActionDialog({
  title,
  economyActions,
  oucIcon,
  $bottom,
}: {
  title: string;
  economyActions: EconomyAction[];
  oucIcon: React.ReactNode;
  $bottom?: React.ReactNode;
}) {
  useStyleSheet(styleSheet);
  return (
    <Dialog headerStyle="primary" headerText={title}>
      <div className="c-economy-action-dialog">
        {economyActions?.map((action) => {
          return <EconomyActionRow economyAction={action} oucIcon={oucIcon} />;
        })}
        {$bottom}
      </div>
    </Dialog>
  );
}

function EconomyActionRow({
  economyAction,
  oucIcon,
}: {
  economyAction: EconomyAction;
  oucIcon: React.ReactNode;
}) {
  return (
    <div className="economy-action">
      <div className="name">{economyAction?.name}</div>
      <div className="reward">
        <div className="icon">{oucIcon}</div>
        <div className="amount">
          {economyAction?.amountValue > 0
            ? economyAction?.amountValue
            : economyAction?.data?.amountDescription}
        </div>
      </div>
      <div className="description">{economyAction?.data?.description}</div>
    </div>
  );
}
