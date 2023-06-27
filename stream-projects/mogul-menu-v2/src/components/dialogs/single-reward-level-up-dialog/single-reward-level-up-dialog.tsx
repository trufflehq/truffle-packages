import { React, useStyleSheet } from "../../../deps.ts";
import { useCurrentTab } from "../../tabs/mod.ts";
import Button from "../../base/button/button.tsx";
import { useDialog } from "../../base/dialog-container/dialog-service.ts";
import Dialog from "../../base/dialog/dialog.tsx";
import Reward from "../../season-pass-reward/season-pass-reward.tsx";
import DefaultDialogContentFragment from "../content-fragments/default/default-dialog-content-fragment.tsx";

import styleSheet from "./single-reward-level-up-dialog.scss.js";

export default function SingleRewardLevelUpDialog({
  reward,
  levelNum,
  onClose,
}: {
  reward: any;
  levelNum: number;
  onClose?: () => void;
}) {
  useStyleSheet(styleSheet);

  const { popDialog } = useDialog();
  const { setActiveTab } = useCurrentTab();
  const closeHandler = onClose ?? popDialog;

  const viewCollectionHandler = () => {
    if (onClose) onClose();
    else popDialog();
    setActiveTab("collection");
  };

  return (
    <div className="c-single-reward-level-up-dialog">
      <Dialog
        headerStyle="gradient"
        headerText="You leveled up!"
        actions={[
          <Button onClick={closeHandler} style="bg-tertiary">
            Close
          </Button>,
          <Button onClick={viewCollectionHandler} style="gradient">
            View collection
          </Button>,
        ]}
        onClose={closeHandler}
      >
        <div className="level-unlock-text mm-text-header-caps">
          Level {levelNum} unlocked
        </div>
        <div className="reward-container">
          <Reward isUnlocked reward={reward} />
        </div>
        <DefaultDialogContentFragment
          primaryText={<>{reward?.source?.name} unlocked!</>}
          secondaryText={reward?.source?.data?.description ??
            reward?.description}
        />
      </Dialog>
    </div>
  );
}
