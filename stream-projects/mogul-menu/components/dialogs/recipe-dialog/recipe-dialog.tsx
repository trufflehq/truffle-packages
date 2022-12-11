import { createSubject, React, useMemo } from "../../../deps.ts";
import Button from "../../base/button/button.tsx";
import { useDialog } from "../../base/dialog-container/dialog-service.ts";
import Dialog from "../../base/dialog/dialog.tsx";
import { RedeemableDialog } from '../redeemable-dialog/redeemable-dialog.tsx'
import DefaultDialogContentFragment from "../content-fragments/default/default-dialog-content-fragment.tsx";

export default function RecipeDialog({ redeemableCollectible }: RedeemableDialog) {
  const { popDialog } = useDialog();

  const { errorStream } = useMemo(() => {
    return {
      selectedColorStream: createSubject(null),
      colorsStream: createSubject(
        redeemableCollectible.source?.data?.redeemData?.colors
      ),
      errorStream: createSubject(""),
    };
  }, []);

  const openCraftTable = () => {
    // overlay.close();
    // pushPage(() => (
    //   <Component
    //     slug="browser-extension-menu-crafting-table"
    //     props={{
    //       redeemableCollectible: redeemableCollectible,
    //       popPage: popPage,
    //       onViewCollection: onViewCollection,
    //       enqueueSnackBar: enqueueSnackBar,
    //     }}
    //   />
    // ));
  };

  return (
    <Dialog
      actions={[
        <Button style="bg-tertiary" onClick={popDialog}>
          Close
        </Button>,
        <Button style="primary" onClick={openCraftTable}>
          Craft an emote
        </Button>,
      ]}
    >
      <DefaultDialogContentFragment
        imageRel={redeemableCollectible?.source?.fileRel?.fileObj}
        primaryText={`${redeemableCollectible?.source?.name} unlocked`}
        secondaryText={
          redeemableCollectible?.description ??
          redeemableCollectible?.source?.data?.description
        }
      />
    </Dialog>
  );

  // return (
  //   <div className="z-recipe-dialog use-css-vars-creator">
  //     <ItemDialog
  //       displayMode="center"
  //       imgRel={redeemableCollectible?.source?.fileRel}
  //       headerText={headerText}
  //       $title={$title}
  //       highlightBg={highlightBg}
  //       errorStream={errorStream}
  //       primaryText={
  //         primaryText ?? `${redeemableCollectible?.source?.name} unlocked`
  //       }
  //       secondaryText={
  //         secondaryText ??
  //         redeemableCollectible?.description ??
  //         redeemableCollectible?.source?.data?.description
  //       }
  //       buttons={[
  //         {
  //           text: "Close",
  //           borderRadius: "4px",
  //           bg: "var(--mm-color-bg-tertiary)",
  //           textColor: "var(--mm-color-text-bg-primary)",
  //           onClick: onExit,
  //         },
  //         {
  //           text: "Craft an emote",
  //           borderRadius: "4px",
  //           style: "primary",
  //           bg: highlightBg ?? "var(--mm-color-primary)",
  //           bgColor: highlightBg ?? "var(--mm-color-primary)",
  //           textColor: "var(--mm-color-text-primary)",
  //           onClick: openCraftTable,
  //         },
  //       ]}
  //       onExit={onExit}
  //     />
  //   </div>
  // );
}
