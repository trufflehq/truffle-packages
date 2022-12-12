import LiveNotificationForm from "../../../components/live-notification-form/live-notification-form.tsx";
import OnlyAdmin from "../../../components/only-admin/only-admin.tsx";
import UserInfo from "../../../components/user-info/user-info.tsx";
import { React, toDist } from "../../../deps.ts";

function NotificationAdminPage() {
  return (
    <>
      <UserInfo />
      <OnlyAdmin>
        <LiveNotificationForm />
      </OnlyAdmin>
    </>
  );
}

export default toDist(NotificationAdminPage, import.meta.url);
export const ROUTE_INSTALL_PATH = "/admin/notifications";
