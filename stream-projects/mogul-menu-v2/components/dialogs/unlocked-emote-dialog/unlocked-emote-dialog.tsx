import { React } from "../../../deps.ts";
import { useCurrentTab } from "../../tabs/mod.ts";
import { Product } from "../../../types/mod.ts";
import Button from "../../base/button/button.tsx";
import { useDialog } from "../../base/dialog-container/dialog-service.ts";
import Dialog from "../../base/dialog/dialog.tsx";
import DefaultDialogContentFragment from "../content-fragments/default/default-dialog-content-fragment.tsx";

export default function UnlockedEmoteDialog({
  reward,
}: {
  reward: Product;
}) {
  const collectible = reward?.source ?? reward;
  const { setActiveTab } = useCurrentTab();
  const { popDialog } = useDialog();
  const viewCollectionHandler = () => {
    popDialog();
    setActiveTab("collection");
  };

  return (
    <div className="z-unlocked-emote-reward-dialog use-css-vars-creator">
      <Dialog
        actions={[
          <Button style="bg-tertiary" onClick={popDialog}>
            Close
          </Button>,
          <Button style="primary" onClick={viewCollectionHandler}>
            View collection
          </Button>,
        ]}
      >
        <DefaultDialogContentFragment
          imageRel={collectible?.fileRel?.fileObj}
          primaryText={`${collectible?.name} emote unlocked!`}
        />
      </Dialog>
    </div>
  );
}
