import { _, gql, React, useMutation } from "../../../deps.ts";
import { ActivePowerupRedeemData, Collectible } from "../../../types/mod.ts";
import { invalidateExtensionUser } from "../../../shared/mod.ts";
import { useDialog } from "../../base/dialog-container/dialog-service.ts";
import { useSnackBar } from "../../snackbar/mod.ts";
import { RedeemableDialog } from "../redeemable-dialog/redeemable-dialog.tsx";
import { PowerupActivatedSnackBar } from "../../snack-bars/powerup-activated-snack-bar/powerup-activated-snack-bar.tsx";
import Dialog from "../../base/dialog/dialog.tsx";
import Button from "../../base/button/button.tsx";
import DefaultDialogContentFragment from "../content-fragments/default/default-dialog-content-fragment.tsx";

const REDEEM_COLLECTIBLE_MUTATION = gql`
  mutation OwnedCollectibleRedeem($collectibleId: ID!, $additionalData: JSON) {
    ownedCollectibleRedeem(
      input: { collectibleId: $collectibleId, additionalData: $additionalData }
    ) {
      redeemResponse
      redeemError
    }
  }
`;

interface ActivatePowerupDialog extends RedeemableDialog {
  additionalData: Record<string, unknown>;
}

export function ActivatePowerupDialog({
  redeemableCollectible,
  children,
  isActivateButtonDisabled = false,
  additionalData = {},
}: {
  redeemableCollectible: {
    description?: string;
    source: Collectible<ActivePowerupRedeemData>;
  };
  children?: React.ReactNode;
  isActivateButtonDisabled?: boolean;
  additionalData?: Record<string, unknown>;
}) {
  const { popDialog } = useDialog();

  const collectible = redeemableCollectible?.source;
  const enqueueSnackBar = useSnackBar();
  const [_redeemResult, executeRedeemMutation] = useMutation(
    REDEEM_COLLECTIBLE_MUTATION,
  );

  const redeemHandler = async () => {
    try {
      const { data: result, error } = await executeRedeemMutation(
        {
          collectibleId: collectible.id,
          additionalData,
        },
        {
          additionalTypenames: [
            "OwnedCollectible",
            "ActivePowerup",
            "Org",
            "OrgConfig",
          ],
        },
      );

      popDialog();

      const { redeemResponse } = result.ownedCollectibleRedeem;
      const { redeemError } = result.ownedCollectibleRedeem;

      if (error) {
        alert("There was an internal error while redeeming; check the logs");
        console.error("Error while redeeming:", error);
      } else if (redeemError) {
        alert("There was an error redeeming: " + redeemError?.message);
      } else {
        enqueueSnackBar(<PowerupActivatedSnackBar collectible={collectible} />);
      }

      invalidateExtensionUser();
    } catch (err) {
      console.log("err", err);
      alert("There was an error redeeming: " + err?.info || err?.message);
    }
  };

  return (
    <Dialog
      actions={[
        <Button style="bg-tertiary" onClick={popDialog}>
          Close
        </Button>,
        <Button
          style="primary"
          isDisabled={isActivateButtonDisabled}
          onClick={redeemHandler}
        >
          Activate
        </Button>,
      ]}
    >
      <DefaultDialogContentFragment
        imageRel={redeemableCollectible?.source?.fileRel?.fileObj}
        primaryText={`${redeemableCollectible?.source?.name} unlocked`}
        secondaryText={redeemableCollectible?.description ??
          redeemableCollectible?.source?.data?.description}
      />
      {children}
    </Dialog>
  );
}
