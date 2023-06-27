import {
  Icon,
  ImageByAspectRatio,
  React,
  useStyleSheet,
} from "../../../deps.ts";
import ProgressBar from "../../base/progress-bar/progress-bar.tsx";
import stylesheet from "./activity-banner-fragment.scss.js";
import {
  CHEVRON_RIGHT_ICON_PATH,
  CLOSE_ICON_PATH,
} from "../../../shared/mod.ts";
import { isActivityBannerOpen$ } from "../signals.ts";

export interface IconConfig {
  url?: string;
  path?: string;
}

export function ActivityBannerIcon(
  { icon, color }: { icon: IconConfig; color: string },
) {
  useStyleSheet(stylesheet);
  return (
    <div className="c-activity-banner-icon">
      {icon?.url
        ? (
          <ImageByAspectRatio
            imageUrl={icon.url}
            aspectRatio={1}
            width={24}
            height={24}
          />
        )
        : icon.path
        ? <Icon icon={icon.path} viewBox={24} size="24px" color={color} />
        : null}
    </div>
  );
}

export function CloseActionIcon() {
  const onClick = () => {
    isActivityBannerOpen$.set(false);
  };
  return (
    <Icon
      icon={CLOSE_ICON_PATH}
      viewBox={24}
      size="24px"
      onclick={onClick}
      color={"#FFFFFF"}
    />
  );
}

export function ContinueActionIcon({ onContinue }: { onContinue: () => void }) {
  return (
    <Icon
      icon={CHEVRON_RIGHT_ICON_PATH}
      viewBox={24}
      size="24px"
      onclick={onContinue}
      color={"#FFFFFF"}
    />
  );
}

export function ActivityBannerSecondaryInfo({ text }: { text: string }) {
  return (
    <div className="c-activity-banner-secondary-info">
      {text}
    </div>
  );
}

export function ActivityBannerInfo(
  { text, children }: { text: string; children?: React.ReactNode },
) {
  return (
    <div className="c-activity-banner-info">
      <div className="text">
        {text}
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default function ActivityBannerFragment(
  { icon, color = "#AF7AF2", title, startTime, endTime, action, children }: {
    icon?: IconConfig;
    color?: string;
    title?: string;
    startTime?: Date;
    endTime?: Date;
    action?: React.ReactNode;
    children: React.ReactNode;
  },
) {
  useStyleSheet(stylesheet);
  const hasElapsedTime = startTime && endTime;
  return (
    <div className="c-activity-banner-fragment">
      {icon
        ? (
          <div className="icon">
            <ActivityBannerIcon icon={icon} color={color} />
          </div>
        )
        : null}
      <div className="content">
        <div className="title">
          {title}
        </div>
        <div className="info">
          {children}
        </div>
      </div>
      {action
        ? (
          <div className="action">
            {action}
          </div>
        )
        : null}
      {hasElapsedTime
        ? (
          <div className="progress">
            <ProgressBar
              startDate={startTime}
              endDate={endTime}
              color={color}
            />
          </div>
        )
        : null}
    </div>
  );
}
