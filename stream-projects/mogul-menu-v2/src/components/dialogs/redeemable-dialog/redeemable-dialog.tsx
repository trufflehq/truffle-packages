import { _, React } from "../../../deps.ts";

import ItemDialog from "../item-dialog/item-dialog.tsx";
import { useDialog } from "../../base/dialog-container/dialog-service.ts";
import { ActiveRedeemableDialog } from "../active-powerup-status-dialog/active-powerup-status-dialog.tsx";
import OpenCollectiblePackDialog from "../open-collectible-pack-dialog/open-collectible-pack-dialog.tsx";
import { ActivatePowerupDialog } from "../activate-powerup-dialog/activate-powerup-dialog.tsx";
import ChatHighlightDialog from "../chat-highlight-dialog/chat-highlight-dialog.tsx";
import UsernameGradientDialog from "../username-gradient-dialog/username-gradient-dialog.tsx";
import RecipeDialog from "../recipe-dialog/recipe-dialog.tsx";
import StreamAlertRedeemDialog from "../stream-alert-redeem-dialog/stream-alert-redeem-dialog.tsx";
import {
  useActivePowerupConnection,
  useOwnedCollectibleConnection,
} from "../../../shared/mod.ts";
import { Collectible } from "../../../types/mod.ts";

export interface RedeemableDialog {
  $title?: React.ReactNode;
  redeemableCollectible: {
    sourceId?: string;
    description?: string;
    source: Collectible<any>;
  };
  collectibles: Collectible<any>[];
  $children?: React.ReactNode;
  headerText?: string;
  primaryText?: string;
  secondaryText?: string;
  highlightBg?: string;
  onExit?: () => void;
}

export default function RedeemableDialog(props: RedeemableDialog) {
  const {
    redeemableCollectible,
    $children,
    primaryText,
    secondaryText,
    highlightBg,
  } = props;

  const { popDialog: onExit } = useDialog();

  const redeemablePowerupId = redeemableCollectible?.source?.data?.redeemData
    ?.powerupId;

  const { activePowerupConnectionData } = useActivePowerupConnection();
  const activePowerups = activePowerupConnectionData?.activePowerupConnection
    ?.nodes;
  const activePowerup = _.find(activePowerups ?? [], {
    powerup: { id: redeemablePowerupId },
  });

  const { ownedCollectibleConnectionData } = useOwnedCollectibleConnection();

  const collectibles = ownedCollectibleConnectionData
    ?.ownedCollectibleConnection?.nodes?.map((
      ownedCollectible,
    ) => ownedCollectible?.collectible);

  const isCollectiblePack =
    redeemableCollectible?.source?.data?.redeemType === "collectiblePack";
  const ownedCollectible = _.find(collectibles, {
    id: redeemableCollectible.sourceId,
  })
    ?.ownedCollectible;
  const isOpenedCollectiblePack = isCollectiblePack &&
    ownedCollectible?.count &&
    ownedCollectible?.count < 1;
  const isChatHighlightPowerup =
    redeemableCollectible?.source?.data?.redeemData?.category ===
      "chatMessageHighlight";
  const isUsernameGradientPowerup =
    redeemableCollectible?.source?.data?.redeemData?.category ===
      "chatUsernameGradient";
  const isRecipe = redeemableCollectible?.source?.data?.redeemType === "recipe";
  const isRedeemed = redeemableCollectible?.source?.ownedCollectible?.count < 1;
  const isStreamAlertCollectible =
    redeemableCollectible?.source?.data?.redeemType === "alertCustomMessage";

  if (!redeemableCollectible || !activePowerups) {
    return <></>;
  }

  let Component;
  if (activePowerup) {
    Component = ActiveRedeemableDialog;
  } else if (isStreamAlertCollectible) {
    Component = StreamAlertRedeemDialog;
  } else if (isCollectiblePack) {
    Component = OpenCollectiblePackDialog;
  } else if (isOpenedCollectiblePack || isRedeemed) {
    Component = RedeemedCollectibleDialog;
  } else if (isChatHighlightPowerup) {
    Component = ChatHighlightDialog;
  } else if (isUsernameGradientPowerup) {
    Component = UsernameGradientDialog;
  } else if (isRecipe) {
    Component = RecipeDialog;
  } else {
    Component = ActivatePowerupDialog;
  }

  return (
    <Component
      redeemableCollectible={redeemableCollectible}
      collectibles={collectibles}
      activePowerup={activePowerup}
      primaryText={primaryText}
      secondaryText={secondaryText}
      onExit={onExit}
    />
  );
}

export function RedeemedCollectibleDialog({
  $title,
  headerText,
  redeemableCollectible,
  highlightBg,
  onExit,
}: RedeemableDialog) {
  return (
    <div className="z-unlocked-emote-reward-dialog use-css-vars-creator">
      <ItemDialog
        displayMode="center"
        imgRel={redeemableCollectible?.source?.fileRel}
        $title={$title}
        highlightBg={highlightBg}
        headerText={headerText}
        primaryText={`${
          redeemableCollectible?.source?.name ?? ""
        } has already been redeemed`}
        secondaryTextStyle=""
        buttons={[
          {
            text: "Close",
            borderRadius: "4px",
            bg: "var(--mm-color-bg-tertiary)",
            textColor: "var(--mm-color-text-bg-primary)",
            onClick: onExit,
          },
        ]}
        onExit={onExit}
      />
    </div>
  );
}
