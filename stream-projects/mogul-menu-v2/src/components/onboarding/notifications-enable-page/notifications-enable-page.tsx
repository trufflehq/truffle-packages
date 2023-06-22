import { React, useStyleSheet } from "../../../deps.ts";
import { useDesktopNotificationSetting } from "../../../shared/mod.ts";
import Button from "../../base/button/button.tsx";
import { Page } from "../../page-stack/mod.ts";

import styleSheet from "./notifications-enable-page.scss.js";

export default function NotificationsEnablePage(
  { onContinue }: { onContinue: (shouldSetupNotifications: boolean) => void },
) {
  useStyleSheet(styleSheet);
  const { setDesktopNotificationPref } = useDesktopNotificationSetting();

  const affirmativeHandler = async () => {
    await setDesktopNotificationPref(true);
    onContinue(true);
  };

  const negativeHandler = () => {
    onContinue(false);
  };

  return (
    <Page isFullSize shouldDisableEscape shouldShowHeader={false}>
      <div className="c-notifications-enable-page">
        <div className="enable-text">
          Would you like to be notified of important updates?
        </div>
        <div className="actions">
          <Button style="bg-tertiary" onClick={negativeHandler}>No</Button>
          <Button
            shouldHandleLoading
            style="primary"
            onClick={affirmativeHandler}
          >
            Yes
          </Button>
        </div>
      </div>
    </Page>
  );
}
