import LiveNotificationForm from "../../components/live-notification-form/live-notification-form.tsx";
import OnlyAdmin from "../../components/only-admin/only-admin.tsx";
import UserInfo from "../../components/user-info/user-info.tsx";
import { React } from "../../deps.ts";

export function NotificationAdminPage() {
  return (
    <>
      <UserInfo />
      <OnlyAdmin>
        <LiveNotificationForm />
      </OnlyAdmin>
    </>
  );
}
