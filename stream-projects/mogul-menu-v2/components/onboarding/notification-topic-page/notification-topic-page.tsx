import { React, useStyleSheet } from "../../../deps.ts";
import Button from "../../base/button/button.tsx";
import NotificationTopicSettings from "../../notifications/notification-topic-settings/notification-topic-settings.tsx";
import { Page } from "../../page-stack/mod.ts";

import styleSheet from "./notifications-topic-page.scss.js";

export default function NotificationTopicPage(
  { onContinue }: { onContinue: () => void },
) {
  useStyleSheet(styleSheet);
  return (
    <Page isFullSize shouldDisableEscape shouldShowHeader={false}>
      <div className="c-notification-topic-page">
        <div className="settings-container">
          <div className="header">
            Awesome, let us know what you want to be notified for
          </div>
          <NotificationTopicSettings />
        </div>
        <div className="action-container">
          <Button style="primary" onClick={onContinue}>Save</Button>
        </div>
      </div>
    </Page>
  );
}
