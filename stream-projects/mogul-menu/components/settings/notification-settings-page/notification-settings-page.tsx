import { React, useStyleSheet } from "../../../deps.ts";
import { useDesktopNotificationSetting } from "../../../shared/mod.ts";
import Switch from "../../base/switch/switch.tsx";
import Page from "../../page-stack/page.tsx";
import styleSheet from "./notification-settings-page.scss.js";
import NotificationTopicSettings from "../../notifications/notification-topic-settings/notification-topic-settings.tsx";

export default function NotificationSettingsPage() {
  useStyleSheet(styleSheet);

  const { isDesktopNotificationsEnabled, setDesktopNotificationPref } =
    useDesktopNotificationSetting();

  return (
    <Page title="Notifications">
      <div className="notifications-page-body">
        <div className="push-notifications">
          <div className="title mm-text-header-caps">
            Desktop notifications
            <div className="input">
              <Switch
                showIsLoading
                value={isDesktopNotificationsEnabled}
                onChange={setDesktopNotificationPref}
              />
            </div>
          </div>
          <div className="description mm-text-body-1">
            Enable to receive notifications while you're not viewing a stream
          </div>
        </div>
        <div className="notification-topics">
          <div className="title mm-text-header-caps">Notifications</div>
          <div className="description mm-text-body-1">
            Choose which notifications to receive
          </div>
          <NotificationTopicSettings />
        </div>
      </div>
    </Page>
  );
}
