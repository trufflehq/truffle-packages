import {
  formatNumber,
  getSrcByImageObj,
  gql,
  ImageByAspectRatio,
  React,
  useMutation,
  useStyleSheet,
} from "../../../deps.ts";
import { useCurrentTab } from "../../tabs/mod.ts";
import { invalidateExtensionUser } from "../../../shared/mod.ts";
import { File, Product } from "../../../types/mod.ts";
import Button from "../../base/button/button.tsx";
import { useDialog } from "../../base/dialog-container/dialog-service.ts";
import Dialog from "../../base/dialog/dialog.tsx";
import UnlockedEmoteDialog from "../unlocked-emote-dialog/unlocked-emote-dialog.tsx";
import DefaultDialogContentFragment from "../content-fragments/default/default-dialog-content-fragment.tsx";
import RedeemableDialog from "../redeemable-dialog/redeemable-dialog.tsx";

import styleSheet from "./confirm-cp-purchase-dialog.scss.js";

const CHANNEL_POINTS_SHOP_PURCHASE_MUTATION = gql`
  mutation ChannelPointsShopPurchase($productId: String!) {
    economyTransactionCreateLegacy(
      input: {
        economyTriggerSlug: "channel-points-store-purchase"
        amountSourceId: $productId
      }
    ) {
      economyTransaction {
        id
      }
    }
  }
`;

export default function ConfirmPurchaseDialog({
  collectibleItem,
  channelPointsImageObj,
  buttonBg,
}: {
  collectibleItem: Product;
  channelPointsImageObj: File;
  buttonBg?: string;
}) {
  useStyleSheet(styleSheet);
  // const { org } = useStream(() => ({
  //   org: model.org.getMe(),
  // }));

  const { pushDialog, popDialog } = useDialog();

  const file = collectibleItem?.source?.fileRel;
  const amount = collectibleItem.productVariants.nodes[0].amountValue;

  const [_purchaseResult, executePurchaseMutation] = useMutation(
    CHANNEL_POINTS_SHOP_PURCHASE_MUTATION,
  );

  // const channelPointsSrc =
  //   model.image.getSrcByImageObj(channelPointsImageObj) ??
  //   "https://cdn.bio/assets/images/features/chrome_extension/channel-points.svg";
  const channelPointsSrc =
    "https://cdn.bio/assets/images/features/browser_extension/channel-points-default.svg";

  const onPurchaseHandler = async () => {
    console.log("on purchase handler");
    await executePurchaseMutation(
      { productId: collectibleItem.id },
      { additionalTypenames: ["OrgUserCounter", "OwnedCollectible"] },
    );
    // alert(`You purchased a ${collectibleItem.source.name}!`);
    // onViewCollection?.();
    // await model.economyTransaction.create({
    //   economyTriggerSlug: "channel-points-store-purchase",
    //   amountSourceId: collectibleItem.id,
    // });
    invalidateExtensionUser();
    // // close confirmation dialog
    // overlay.close();
    // // open purchase notification dialog
    // overlay.open(NotifyPurchaseDialog, {
    //   onViewCollection,
    //   collectibleItem,
    //   buttonBg,
    //   enqueueSnackBar,
    // });
    popDialog();
    pushDialog(
      <NotifyPurchaseDialog
        collectibleItem={collectibleItem}
        buttonBg={buttonBg}
      />,
    );
  };

  return (
    <div className="c-confirm-cp-purchase-dialog">
      <Dialog
        actions={[
          <Button onClick={onPurchaseHandler} style="primary">
            {`Buy ${collectibleItem?.source?.name ?? ""}`}
          </Button>,
        ]}
      >
        <div className="body">
          <div className="image">
            <img src={getSrcByImageObj(file?.fileObj)} width="56" />
          </div>
          <div className="info">
            <div className="name">{collectibleItem?.source?.name ?? ""}</div>
            <div className="cost">
              <div className="value">{formatNumber(amount)}</div>
              <ImageByAspectRatio
                imageUrl={channelPointsSrc}
                aspectRatio={1}
                widthPx={15}
                height={15}
              />
            </div>
            {(collectibleItem?.source?.data?.description && (
              <div className="description">
                {collectibleItem?.source?.data?.description}
              </div>
            )) || (
              <div className="description">
                Add {collectibleItem?.source?.name ?? ""} to your collection
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function NotifyPurchaseDialog(
  { collectibleItem, buttonBg }: { collectibleItem: Product; buttonBg?: string },
) {
  const { popDialog } = useDialog();
  const { setActiveTab } = useCurrentTab();

  const onViewCollectionHandler = () => {
    popDialog();
    setActiveTab("collection");
  };

  const file = collectibleItem?.source?.fileRel;
  const actionMessage = collectibleItem?.source?.data?.category === "flair"
    ? "Redeem in Profile Tab"
    : "View collection";
  const isEmote = collectibleItem?.source?.type === "emote";
  const isRedeemable = collectibleItem?.source?.type === "redeemable";

  console.log("collectibleItem", collectibleItem);
  return (
    <>
      {isEmote
        ? <UnlockedEmoteDialog reward={collectibleItem} />
        : isRedeemable
        ? <RedeemableDialog redeemableCollectible={collectibleItem} />
        : (
          <Dialog
            actions={[
              <Button style="primary" onClick={onViewCollectionHandler}>
                {actionMessage}
              </Button>,
            ]}
          >
            <DefaultDialogContentFragment
              imageRel={file?.fileObj}
              primaryText={
                <div>
                  <strong>{collectibleItem?.source?.name ?? ""}</strong> added to your collection!
                </div>
              }
            />
          </Dialog>
        )}
    </>
  );
}
