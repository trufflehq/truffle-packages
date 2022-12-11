import { React, semver, useExtensionInfo, useSelector } from "../../../deps.ts";
import { hasPermission, isGoogleChrome, useOrgUserWithRoles$ } from "../../../shared/mod.ts";
import MenuItem from "../../base/menu-item/menu-item.tsx";
import { Page, usePageStack } from "../../page-stack/mod.ts";
import AccountDetailsPage from "../account-details-page/account-details-page.tsx";
import AdminSettingsPage from "../admin-settings-page/admin-settings-page.tsx";
import NotificationSettingsPage from "../notification-settings-page/notification-settings-page.tsx";

export default function SettingsPage() {
  const { pushPage } = usePageStack();
  const orgUserWithRoles$ = useOrgUserWithRoles$();

  const hasAdminPermissions = useSelector(() =>
    hasPermission({
      orgUser: orgUserWithRoles$.orgUser.get!(),
      actions: ["update"],
      filters: {
        channel: { isAll: true, rank: 0 },
      },
    })
  );

  // notifications are currently only supported in google chrome

  // make sure the extension supports notifications (version 3.3.4)
  const { extensionInfo } = useExtensionInfo();
  const supportsNotifications = extensionInfo && semver.satisfies(extensionInfo.version, ">=3.3.4");

  return (
    <Page title="Settings">
      <MenuItem
        icon="accountCircle"
        onClick={() => pushPage(<AccountDetailsPage />)}
      >
        Account details
      </MenuItem>
      {
        isGoogleChrome && supportsNotifications && (
          <MenuItem
            icon="notifications"
            onClick={() => pushPage(<NotificationSettingsPage />)}
          >
            Notifications
          </MenuItem>
        )
        /* <MenuItem icon="smile">Emotes</MenuItem>
      <MenuItem icon="desktop">Connections</MenuItem> */
      }
      {hasAdminPermissions
        ? (
          <MenuItem icon="badge" onClick={() => pushPage(<AdminSettingsPage />)}>
            Admin Settings
          </MenuItem>
        )
        : null}
    </Page>
  );
}
