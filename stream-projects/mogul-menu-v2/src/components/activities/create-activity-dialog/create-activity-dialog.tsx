import { Icon, React, useStyleSheet } from "../../../deps.ts";
import {
  CRYSTAL_BALL_ICON,
  DISCO_BALL_PATH,
  PARACHUTE_ICON_PATH,
} from "../../../shared/mod.ts";
import Button from "../../base/button/button.tsx";
import Dialog from "../../base/dialog/dialog.tsx";
import { useDialog } from "../../base/dialog-container/dialog-service.ts";

import styleSheet from "./create-activity-dialog.scss.js";
import { usePageStack } from "../../page-stack/mod.ts";

import CreatePredictionPage from "../create-prediction-page/create-prediction-page.tsx";
import CreateRaidPage from "../create-raid-page/create-raid-page.tsx";
import CreateWatchPartyPage from "../create-watch-party-page/create-watch-party-page.tsx";

const DEFAULT_TILES = [
  {
    Component: PredictionTile,
  },
  {
    Component: RaidTile,
  },
  {
    Component: WatchPartyTile,
  },
];
export default function CreateActivityDialog() {
  useStyleSheet(styleSheet);

  return (
    <div className="c-create-activity-dialog">
      <Dialog headerText="Select an activity">
        <div className="body">
          <div className="grid">
            {DEFAULT_TILES.map(({ Component }) => <Component />)}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function PredictionTile() {
  const { pushPage } = usePageStack();
  const { popDialog } = useDialog();
  const onClick = () => {
    popDialog();
    pushPage(<CreatePredictionPage />);
  };

  return (
    <CreateActivityTile
      icon={CRYSTAL_BALL_ICON}
      iconViewBox={20}
      color="#AF7AF2"
      activityType="Prediction"
      description="Engage fans by allowing them to vote on an outcome"
      actionButtonText="Start a prediction"
      onClick={onClick}
    />
  );
}

function RaidTile() {
  const { pushPage } = usePageStack();
  const { popDialog } = useDialog();
  const onClick = () => {
    popDialog();
    pushPage(<CreateRaidPage />);
  };

  return (
    <CreateActivityTile
      icon={PARACHUTE_ICON_PATH}
      iconViewBox={24}
      color="#F86969"
      activityType="Raid"
      description="Send viewers to a video, streamer, or site after your stream ends"
      actionButtonText="Start a raid"
      onClick={onClick}
    />
  );
}

function WatchPartyTile() {
  const { pushPage } = usePageStack();
  const { popDialog } = useDialog();
  const onClick = () => {
    popDialog();
    pushPage(<CreateWatchPartyPage />);
  };

  return (
    <CreateActivityTile
      icon={DISCO_BALL_PATH}
      iconViewBox={24}
      color="#71DBDB"
      activityType="Watch Party"
      description="Watch a video with chat before streams"
      actionButtonText="Start watch party"
      onClick={onClick}
    />
  );
}

export function CreateActivityTile({
  icon,
  color,
  iconViewBox = 20,
  activityType,
  description,
  actionButtonText,
  onClick,
}: {
  icon: string;
  color: string;
  iconViewBox?: number;
  activityType: string;
  description: string;
  actionButtonText: string;
  onClick: () => void;
}) {
  return (
    <div className="c-create-activity-tile">
      <div
        className="icon"
        style={{
          backgroundColor: color,
        }}
      >
        <Icon
          icon={icon}
          color="var(--mm-color-bg-secondary)"
          viewBox={iconViewBox}
          size="28px"
        />
      </div>
      <div className="title">
        {activityType}
      </div>
      <div className="description">
        {description}
      </div>
      <Button className="action-button" onClick={onClick}>
        {actionButtonText}
      </Button>
    </div>
  );
}
