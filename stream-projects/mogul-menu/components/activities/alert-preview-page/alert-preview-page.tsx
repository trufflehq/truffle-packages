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
import { useDialog } from "../../base/dialog-container/dialog-service.ts";

import { AlertPreviewIframe } from "../create-alert-page/create-alert-page.tsx";
import stylesheet from "./alert-preview-page.scss.js";

const END_ALERT_MUTATION_QUERY = gql`
mutation EndAlertMutation($id: ID!) {
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

const DELETE_ALERT_MUTATION_QUERY = gql`
mutation DeleteAlertMutation($id: ID!) {
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

export const ALERT_SUBSCRIPTION = gql`
  subscription AlertSubscription($id: ID) {
    alert(input: { id:$id }) {
      id
      status
      time
      data
    }
  }
`;

export default function AlertPreviewPage(
  {
    pageTitle,
    alertId,
    activeText,
    deleteConfirmText,
    endButtonText = "End",
    hasAdminPerms = false,
  }: {
    pageTitle: string;
    alertId: string;
    activeText: string;
    deleteConfirmText: string;
    endButtonText?: string;
    hasAdminPerms?: boolean;
  },
) {
  useStyleSheet(stylesheet);
  const [, executeEndAlertMutation] = useMutation(END_ALERT_MUTATION_QUERY);
  const [, executeDeleteAlertMutation] = useMutation(
    DELETE_ALERT_MUTATION_QUERY,
  );
  const { pushDialog, popDialog } = useDialog();
  const previewSrc$ = useSignal("");

  const alertError$ = useSignal("");
  const { signal$: alert$ } = useSubscriptionSignal(ALERT_SUBSCRIPTION, {
    id: alertId,
  });
  const { popPage } = usePageStack();
  const onEndAlert = async () => {
    const result = await executeEndAlertMutation({ id: alertId });

    if (result.error?.graphQLErrors?.length) {
      alertError$.set(result.error.graphQLErrors[0].message);
    } else {
      popPage();
    }
  };

  const onDeleteAlert = async () => {
    const result = await executeDeleteAlertMutation({ id: alertId });

    if (result.error?.graphQLErrors?.length) {
      alertError$.set(result.error.graphQLErrors[0].message);
    } else {
      popPage();
      popDialog();
    }
  };

  const onDelete = () => {
    pushDialog(
      <DeleteDialog
        title={deleteConfirmText}
        onDelete={onDeleteAlert}
        error$={alertError$}
      />,
    );
  };

  const title = useSelector(() => alert$.data.alert.data.title?.get());
  const description = useSelector(() =>
    alert$.data.alert.data.description?.get()
  );
  const isReady = useSelector(() =>
    alert$.data.alert.status?.get() === "ready"
  );

  useObserve(() => {
    const src = getPreviewSrc(alert$.data.alert.data.url?.get());
    // needed to add this check since is was updating the previewSrc$ even when the src was the same
    // and causing the YT embed to refire its loading animation
    const previewSrc = previewSrc$.get();
    if (src && src !== previewSrc) {
      previewSrc$.set(src);
    }
  });

  const previewSrc = useSelector(() => previewSrc$.get());
  const alertError = useSelector(() => alertError$.get());
  const alertCreatedAt = useSelector(() =>
    new Date(alert$.data.alert.time?.get())
  );
  return (
    <Page
      title={pageTitle}
      shouldShowHeader
      footer={
        <div className="c-alert-preview-page__footer">
          {hasAdminPerms
            ? (
              <Button
                style="bg-tertiary"
                onClick={onDelete}
                shouldHandleLoading
              >
                Delete
              </Button>
            )
            : null}
          {isReady && hasAdminPerms
            ? (
              <Button
                style="bg-tertiary"
                onClick={onEndAlert}
                shouldHandleLoading
              >
                {endButtonText}
              </Button>
            )
            : null}
        </div>
      }
    >
      <div className="c-alert-preview-page">
        {title ? <div className="title">{title}</div> : null}
        {description ? <div className="description">{description}</div> : null}
        <div className="info">
          {isReady ? activeText : getFormattedDate(alertCreatedAt)}
        </div>
        {alertError ? <div className="error">{alertError}</div> : null}
        {previewSrc
          ? (
            <div className="preview">
              <AlertPreviewIframe previewSrc={previewSrc} />
            </div>
          )
          : null}
      </div>
    </Page>
  );
}

function getFormattedDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
