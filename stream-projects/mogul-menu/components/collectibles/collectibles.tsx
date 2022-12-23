import { _, React, useStyleSheet } from "../../deps.ts";
import Collectible from "../collectible/collectible.tsx";
import { usePageStack } from "../page-stack/mod.ts";

import styleSheet from "./collectibles.scss.js";
import { useCurrentTab } from "../tabs/mod.ts";
import {
  useActivePowerupConnection,
  useOwnedCollectibleConnection,
} from "../../shared/mod.ts";
import {
  ActivePowerup,
  ActivePowerupRedeemData,
  Collectible as ICollectible,
  CollectibleType,
  OwnedCollectibleConnection,
} from "../../types/mod.ts";

import { useSnackBar } from "../snackbar/mod.ts";

import Button from "../base/button/button.tsx";
import LinkButton from "../base/link-button/link-button.tsx";
import ChannelPointsIcon from "../channel-points-icon/channel-points-icon.tsx";
import XPIcon from "../xp-icon/xp-icon.tsx";
import XpActionsDialog from "../dialogs/xp-actions-dialog/xp-actions-dialog.tsx";
import { useDialog } from "../base/dialog-container/dialog-service.ts";
import ChannelPointsActionsDialog from "../dialogs/channel-points-actions-dialog/channel-points-actions-dialog.tsx";

const TYPE_ORDER = ["redeemable", "emote"];
const ORDER_FN = ({ type }: { type: CollectibleType }) => {
  const order = TYPE_ORDER.indexOf(type);
  return order === -1 ? 9999 : order;
};

export default function Collectibles() {
  useStyleSheet(styleSheet);

  const enqueueSnackBar = useSnackBar();
  const { pushPage, popPage } = usePageStack();

  const { ownedCollectibleConnectionData } = useOwnedCollectibleConnection();

  const ownedCollectibleConnection: OwnedCollectibleConnection =
    ownedCollectibleConnectionData
      ?.ownedCollectibleConnection;

  const sortedCollectibles = _.orderBy(
    ownedCollectibleConnection?.nodes,
    (ownedCollectible) => ownedCollectible?.count,
  );

  const collectibles = sortedCollectibles.map((ownedCollectible) => {
    return {
      ...ownedCollectible.collectible,
      ownedCollectible: {
        count: ownedCollectible.count,
      },
    };
  })
    .filter((collectible) => Boolean(collectible) && collectible?.type);

  const groups = _.groupBy(collectibles, "type");

  const groupedCollectibles = _.orderBy(
    Object.keys(groups).map((type) => ({
      type,
      collectibles: groups[type],
    }), ORDER_FN),
  );

  const { activePowerupConnectionData } = useActivePowerupConnection();

  const activePowerups =
    activePowerupConnectionData?.activePowerupConnection?.nodes ?? [];

  const isEmpty = !ownedCollectibleConnection?.nodes?.length;

  if (isEmpty) return <NoCollectiblesPlaceholder />;

  return (
    <div className="c-collectibles">
      {groupedCollectibles.map(
        (
          { collectibles, type },
          idx,
        ) => {
          return (
            <div key={idx} className="type-section">
              <div className="type">{type}</div>
              <div className="collectibles">
                {_.map(
                  collectibles,
                  (collectible: ICollectible<ActivePowerupRedeemData>, idx) => {
                    const powerupId = collectible?.data?.redeemData?.powerupId;
                    const activePowerup = _.find(activePowerups, {
                      powerup: { id: powerupId },
                    });

                    return (
                      shouldShowCollectible(activePowerups, collectible) && (
                        <Collectible
                          key={idx}
                          collectible={collectible}
                          activePowerup={activePowerup}
                        />
                      )
                    );
                  },
                )}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}

function shouldShowCollectible(
  activePowerups: ActivePowerup[],
  collectible: ICollectible<ActivePowerupRedeemData>,
) {
  const powerupId = collectible?.data?.redeemData?.powerupId;
  const activePowerup = _.find(activePowerups, {
    powerup: { id: powerupId },
  });

  return collectible?.ownedCollectible?.count > 0 || activePowerup;
}

function NoCollectiblesPlaceholder() {
  return (
    <div className="c-no-collectibles-placeholder">
      <NoCollectibles />
      <EarnCollectibles />
    </div>
  );
}

function NoCollectibles() {
  return (
    <div className="c-no-collectibles">
      <img
        src="https://cdn.betterttv.net/emote/5e0fa9d40550d42106b8a489/2x"
        width="60"
      />
      <div className="mm-text-subtitle-1">Nothing in your collection, yet!</div>
    </div>
  );
}

function EarnCollectibles() {
  const { setActiveTab } = useCurrentTab();
  const { pushDialog } = useDialog();

  return (
    <div className="c-earn-collectibles">
      <div className="heading mm-text-header-caps">Start earning</div>
      <WayToEarn
        icon={<XPIcon />}
        description="Earn XP to unlock rewards in the Battle pass"
        button={
          <Button onClick={() => setActiveTab("battle-pass")} style="primary">
            Go to Battle pass
          </Button>
        }
        oucLink={
          <LinkButton onClick={() => pushDialog(<XpActionsDialog />)}>
            How do I earn XP?
          </LinkButton>
        }
      />
      <WayToEarn
        icon={<ChannelPointsIcon />}
        description="Earn channel points to buy items in the shop"
        button={
          <Button onClick={() => setActiveTab("shop")} style="primary">
            Go to Shop
          </Button>
        }
        oucLink={
          <LinkButton
            onClick={() => pushDialog(<ChannelPointsActionsDialog />)}
          >
            How do I earn channel points?
          </LinkButton>
        }
      />
    </div>
  );
}

function WayToEarn({
  description,
  icon,
  button,
  oucLink,
}: {
  description: string;
  icon: React.ReactNode;
  button: React.ReactNode;
  oucLink: React.ReactNode;
}) {
  return (
    <div className="c-way-to-earn-collectibles">
      <div className="left">
        <div className="icon">{icon}</div>
      </div>
      <div className="right">
        <div className="description mm-text-body-1">{description}</div>
        <div className="button">{button}</div>
        <div className="ouc-link">{oucLink}</div>
      </div>
    </div>
  );
}
