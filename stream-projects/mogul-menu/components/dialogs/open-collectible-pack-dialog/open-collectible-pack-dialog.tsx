import { _, gql, Obs, React, useMutation, useObservables, useQuery } from "../../../deps.ts";
import { useCurrentTab } from "../../tabs/mod.ts";
import Button from "../../base/button/button.tsx";
import { useDialog } from "../../base/dialog-container/dialog-service.ts";
import { RedeemableDialog } from "../redeemable-dialog/redeemable-dialog.tsx";
import { ActivePowerupRedeemData, Collectible } from "../../../types/mod.ts";
import { useCollectibleConnection, invalidateExtensionUser } from '../../../shared/mod.ts'
import Dialog from "../../base/dialog/dialog.tsx";
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

export default function OpenCollectiblePackDialog({ redeemableCollectible }: RedeemableDialog) {
  const { pushDialog, popDialog } = useDialog();

  // rm this if we're not invalidating cache using jumper
  const { org } = useObservables(() => ({
    org: Obs.from([{}]),
  }));

  const { collectibleConnectionData } = useCollectibleConnection()
  const collectibles: Collectible<ActivePowerupRedeemData>[] = collectibleConnectionData
    ?.collectibleConnection
    ?.nodes;

  const collectible = redeemableCollectible?.source;
  const [_redeemResult, executeRedeemMutation] = useMutation(
    REDEEM_COLLECTIBLE_MUTATION,
  );

  const redeemHandler = async () => {
    try {
      const { data: result, error } = await executeRedeemMutation(
        {
          collectibleId: collectible.id,
        },
        {
          additionalTypenames: ["OwnedCollectible", "ActivePowerup"],
        },
      );

      const { redeemResponse } = result.ownedCollectibleRedeem;
      const { redeemError } = result.ownedCollectibleRedeem;

      if (error) {
        alert("There was an internal error while redeeming; check the logs");
        console.error("Error while redeeming:", error);
      } else if (redeemError) {
        alert("There was an error redeeming: " + redeemError?.message);
      } else {
        const collectibleIds: string[] = redeemResponse?.collectibleIds;
        const packCollectible = _.find(
          collectibles,
          (collectible) => collectibleIds.includes(collectible?.id),
        );
        // const packCollectible =
        popDialog();
        pushDialog(
          <OpenedPackCollectibleDialog packCollectible={packCollectible} />,
        );
      }

      invalidateExtensionUser()
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
        <Button style="primary" onClick={redeemHandler}>
          Open
        </Button>,
      ]}
    >
      <DefaultDialogContentFragment
        imageRel={redeemableCollectible?.source?.fileRel?.fileObj}
        primaryText={`${redeemableCollectible?.source?.name} unlocked`}
        secondaryText={redeemableCollectible?.description ??
          redeemableCollectible?.source?.data?.description}
      />
    </Dialog>
  );
}

// shown after opening a collectible pack
function OpenedPackCollectibleDialog(
  { packCollectible }: { packCollectible?: Collectible<ActivePowerupRedeemData> },
) {
  const { popDialog } = useDialog();
  const { setActiveTab } = useCurrentTab();
  const viewCollectionHandler = () => {
    popDialog();
    setActiveTab("collection");
  };

  if (!packCollectible) {
    return <></>;
  }

  return (
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
        imageRel={packCollectible?.fileRel?.fileObj}
        primaryText={`You opened a ${packCollectible?.name} emote`}
        secondaryText="Try using the emote in chat!"
      />
    </Dialog>
  );
}
