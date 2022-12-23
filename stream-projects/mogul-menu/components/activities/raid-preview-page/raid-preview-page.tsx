import {
  getPreviewSrc,
  gql,
  React,
  useMutation,
  useObserve,
  useSelector,
  useSignal,
  useStyleSheet,
  useSubscriptionSignal,
} from "../../../deps.ts";
import { Page, usePageStack } from "../../page-stack/mod.ts";
import Button from "../../base/button/button.tsx";
import DeleteDialog from "../../delete-dialog/delete-dialog.tsx";
import AlertPreviewPage from "../alert-preview-page/alert-preview-page.tsx";
import { useDialog } from "../../base/dialog-container/dialog-service.ts";
import { hasPermission, useOrgUserWithRoles$ } from "../../../shared/mod.ts";
import { AlertPreviewIframe } from "../create-alert-page/create-alert-page.tsx";
import stylesheet from "./raid-preview-page.scss.js";

const END_RAID_MUTATION_QUERY = gql`
mutation EndRaidMutation($id: ID!) {
  alertMarkShown(
    input: {
      id: $id
    }
  ) {
    alert {
      id
    }
  }
}
`;

const DELETE_RAID_MUTATION_QUERY = gql`
mutation DeleteRaidMutation($id: ID!) {
  alertDeleteById(
    input: {
      id: $id
    }
  ) {
    alert {
      id
    }
  }
}
`;

export const RAID_SUBSCRIPTION = gql`
  subscription RaidSubscription($id: ID) {
    alert(input: { id:$id }) {
      id
      status
      time
      data
    }
  }
`;

export default function RaidPreviewPage({ alertId }: { alertId: string }) {
  const orgUserWithRoles$ = useOrgUserWithRoles$();

  const hasAlertPermissions = useSelector(() =>
    hasPermission({
      orgUser: orgUserWithRoles$.orgUser.get!(),
      actions: ["update", "delete"],
      filters: {
        alert: { isAll: true, rank: 0 },
      },
    })
  );

  return (
    <AlertPreviewPage
      pageTitle="Raid"
      alertId={alertId}
      activeText="Raid active"
      deleteConfirmText="Are you sure you want to delete this raid?"
      endButtonText="End raid"
      hasAdminPerms={hasAlertPermissions}
    />
  );
}

function getFormattedDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
