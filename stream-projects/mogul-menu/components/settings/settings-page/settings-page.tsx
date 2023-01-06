import { React, semver, useExtensionInfo, useSelector } from "../../../deps.ts";
import {
  hasPermission,
  isGoogleChrome,
  useIsNative,
  useOrgUser$,
} from "../../../shared/mod.ts";
import MenuItem from "../../base/menu-item/menu-item.tsx";
import { Page, usePageStack } from "../../page-stack/mod.ts";
import Version from "../../version/version.tsx";
import AccountDetailsPage from "../account-details-page/account-details-page.tsx";
import AdminSettingsPage from "../admin-settings-page/admin-settings-page.tsx";
import NotificationSettingsPage from "../notification-settings-page/notification-settings-page.tsx";

export default function SettingsPage() {
  const { pushPage } = usePageStack();
  const { orgUser$ } = useOrgUser$();

  const hasAdminPermissions = useSelector(() =>
    hasPermission({
      orgUser: orgUser$.orgUser.get!(),
      actions: ["update"],
      filters: {
        channel: { isAll: true, rank: 0 },
      },
    })
  );

  // notifications are currently only supported in google chrome and native

  // make sure the extension supports notifications (version 3.3.4)
  const { extensionInfo } = useExtensionInfo();
  const isNative = useIsNative();
  const supportsNotifications = (isGoogleChrome || isNative) && extensionInfo &&
    semver.satisfies(extensionInfo.version, ">=3.3.4");

  return (
    <Page title="Settings">
      <MenuItem
        icon="accountCircle"
        onClick={() => pushPage(<AccountDetailsPage />)}
      >
        Account details
      </MenuItem>
      {
        supportsNotifications && (
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
          <MenuItem
            icon="badge"
            onClick={() => pushPage(<AdminSettingsPage />)}
          >
            Admin Settings
          </MenuItem>
        )
        : null}
      <Version />
    </Page>
  );
}
