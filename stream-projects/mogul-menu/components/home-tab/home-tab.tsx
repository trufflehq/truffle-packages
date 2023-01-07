import {
  abbreviateNumber,
  formatNumber,
  Icon,
  ImageByAspectRatio,
  React,
  useSelector,
  useStyleSheet,
} from "../../deps.ts";

import styleSheet from "./home-tab.scss.js";

import { usePageStack } from "../page-stack/mod.ts";
import ActivePowerups from "../active-powerups/active-powerups.tsx";
import AccountAvatar from "../account-avatar/account-avatar.tsx";
import Watchtime from "../watchtime/watchtime.tsx";
import PredictionTile from "../prediction-tile/prediction-tile.tsx";
import KothTile from "../koth-tile/koth-tile.tsx";
import SettingsPage from "../settings/settings-page/settings-page.tsx";
import {
  useActivePowerupConnection,
  useFirstTimeNotificationBanner,
  useOrgUser$,
} from "../../shared/mod.ts";
import BrowserExtensionNotificationDialog from "../dialogs/notification-dialog/notification-dialog.tsx";
import { useDialog } from "../base/dialog-container/dialog-service.ts";
import { useChannelPoints } from "../channel-points/hooks.ts";
// import BattlepassLeaderboardTile from "../battlepass-leaderboard-tile/battlepass-leaderboard-tile.tsx";
import IsLive from "../is-live/is-live.tsx";
import CPSpentTile from "../cp-spent-tile/cp-spent-tile.tsx";

export default function HomeTab() {
  useStyleSheet(styleSheet);
  const { orgUser$ } = useOrgUser$();
  const { channelPointsData } = useChannelPoints();
  const { activePowerupConnectionData } = useActivePowerupConnection();
  const activePowerups =
    activePowerupConnectionData?.activePowerupConnection?.nodes ?? [];
  const orgUser = useSelector(orgUser$.get());
  const name = orgUser?.orgUser?.name;

  let fullChannelPointsStr, channelPointsStr;
  if (channelPointsData?.orgUserCounterType) {
    fullChannelPointsStr = formatNumber(
      channelPointsData.orgUserCounterType?.orgUserCounter?.count ?? 0,
    );
    channelPointsStr = abbreviateNumber(
      channelPointsData.orgUserCounterType?.orgUserCounter.count ?? 0,
      2,
    );
  }

  const xp = orgUser?.seasonPass?.xp?.count;
  const hasChannelPoints = true;
  const hasBattlePass = xp !== undefined;

  const { pushPage } = usePageStack();
  const { pushDialog } = useDialog();

  const channelPointsSrc =
    "https://cdn.bio/assets/images/features/browser_extension/channel-points-default.svg";
  const xpSrc =
    "https://cdn.bio/assets/images/features/browser_extension/xp.svg";

  const handleOpenNotificationDialog = () => {
    pushDialog(<BrowserExtensionNotificationDialog />);
  };

  useFirstTimeNotificationBanner();

  return (
    <div className="c-home-tab">
      <div className="header">
        <div className="user">
          <AccountAvatar size="72px" />
          <div className="info">
            <div className="top">
              <div className="name">{name}</div>
              <ActivePowerups activePowerups={activePowerups} />
            </div>
            <div className="amounts">
              {hasChannelPoints && (
                <div className="amount">
                  <div className="icon">
                    <ImageByAspectRatio
                      imageUrl={channelPointsSrc}
                      aspectRatio={1}
                      width={20}
                      height={20}
                    />
                  </div>
                  <div
                    className="amount"
                    title={fullChannelPointsStr}
                  >
                    {channelPointsStr ?? "..."}
                  </div>
                </div>
              )}
              {hasBattlePass &&
                (
                  <div className="amount">
                    <div className="icon">
                      <ImageByAspectRatio
                        imageUrl={xpSrc}
                        aspectRatio={1}
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className="amount">{abbreviateNumber(xp || 0, 1)}</div>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="actions">
          <div className="icon">
            <Icon
              icon="settings"
              onclick={() => pushPage(<SettingsPage />)}
              hasRipple={true}
              size="24px"
              iconViewBox="24px"
            />
          </div>
          <div className="icon">
            <Icon
              icon="bell"
              onclick={handleOpenNotificationDialog}
              hasRipple={true}
              size="24px"
              iconViewBox="24px"
            />
          </div>
        </div>
      </div>
      <div className="tile-grid">
        <IsLive sourceType="youtube">
          <Watchtime
            hasChannelPoints={hasChannelPoints}
            hasBattlePass={hasBattlePass}
          />
        </IsLive>
        {typeof window !== "undefined" &&
            window.location.href.includes("new.ludwig.social")
          ? (
            <a
              className="mobile-beta"
              href="https://bit.ly/3WfPtSn"
              target="_blank"
            >
            </a>
          )
          : ""}
        {
          /*
          (if re-enabling search for "seasonpassdisabled")
          <BattlepassLeaderboardTile orgUser$={orgUser$} />
        */
        }
        <PredictionTile orgUser$={orgUser$} />
        <CPSpentTile orgUser$={orgUser$} />
        <KothTile orgUser$={orgUser$} />
      </div>
    </div>
  );
}
