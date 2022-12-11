import { React } from "../../deps.ts";
import { useUserKV } from "../../shared/util/kv/hooks.ts";
import { HAS_SEEN_NOTIFICATION_SETUP_BANNER } from "../../shared/util/notifications/constants.ts";
import ActionBanner from "../action-banner/action-banner.tsx";
import { useActionBanner } from "../action-banner/mod.ts";
import Button from "../base/button/button.tsx";
import { usePageStack } from "../page-stack/mod.ts";
import NotificationSettingsPage from "../settings/notification-settings-page/notification-settings-page.tsx";

export default function SetupNotificationsBanner(
  { actionBannerIdRef }: { actionBannerIdRef: React.MutableRefObject<string> },
) {
  const { pushPage } = usePageStack();
  const { removeActionBanner } = useActionBanner();
  const { setUserKV: setHasSeen } = useUserKV(HAS_SEEN_NOTIFICATION_SETUP_BANNER);

  const affirmativeClickHandler = () => {
    setHasSeen("true");
    removeActionBanner(actionBannerIdRef.current);
    pushPage(<NotificationSettingsPage />);
  };

  const negativeClickHandler = () => {
    setHasSeen("true");
    removeActionBanner(actionBannerIdRef.current);
  };

  return (
    <ActionBanner
      action={
        <>
          <Button onClick={negativeClickHandler}>No</Button>
          <Button onClick={affirmativeClickHandler}>Yes! Set them up</Button>
        </>
      }
    >
      <>Would you like to receive desktop notifications?</>
    </ActionBanner>
  );
}
