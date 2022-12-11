import {
  getPreviewSrc,
  gql,
  Observable,
  React,
  useMutation,
  useObserve,
  useSelector,
  useSignal,
  useStyleSheet,
} from "../../../deps.ts";
import { useSnackBar } from "../../snackbar/mod.ts";
import { Page, usePageStack } from "../../page-stack/mod.ts";
import Button from "../../base/button/button.tsx";
import Input from "../../base/input/input.tsx";
import TextArea from "../../base/text-area/text-area.tsx";

import stylesheet from "./create-alert-page.scss.js";

const CREATE_ALERT_MUTATION_QUERY = gql`
mutation CreateAlertMutation($title: String, $url: String, $description: String, $type: String) {
  alertUpsert(
    input: {
      type: $type
      message: $title
      data: {
        url: $url,
        title: $title,
        description: $description
      },
      ttl: 0
    }
  ) {
    alert {
      id
    }
  }
}
`;

interface AlertForm {
  link: string;
  title: string;
  description: string;
}

export default function CreateAlertPage(
  {
    type,
    pageTitle,
    pageDescription,
    titleLabel,
    titlePlaceholder,
    descriptionLabel,
    descriptionPlaceholder,
    createButtonTitle,
    alertCreatedSnackbar,
  }: {
    type: "raid-stream" | "watch-party";
    pageTitle: string;
    pageDescription: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    createButtonTitle: string;
    alertCreatedSnackbar: React.ReactNode;
  },
) {
  useStyleSheet(stylesheet);
  const alertUpsertError$ = useSignal("");
  const alertForm$ = useSignal<AlertForm>({
    link: "",
    title: "",
    description: "",
  });

  const [, executeCreateAlertMutation] = useMutation(CREATE_ALERT_MUTATION_QUERY);
  const { popPage } = usePageStack();
  const enqueueSnackBar = useSnackBar();

  const onClick = async () => {
    const result = await executeCreateAlertMutation({
      type,
      title: alertForm$.title.get(),
      description: alertForm$.description.get(),
      url: alertForm$.link.get(),
    });

    if (result.error?.graphQLErrors?.length) {
      alertUpsertError$.set(result.error.graphQLErrors[0].message);
    } else {
      popPage();
      enqueueSnackBar(alertCreatedSnackbar);
    }
  };

  const canSubmit = useSelector(() => {
    return Boolean(alertForm$.link.get());
  });

  const alertUpsertError = useSelector(() => alertUpsertError$.get());
  return (
    <Page
      title={pageTitle}
      shouldShowHeader
      footer={
        <div className="c-create-alert-page__footer">
          <Button
            style={"primary"}
            onClick={onClick}
            shouldHandleLoading
            isDisabled={!canSubmit}
          >
            {createButtonTitle}
          </Button>
        </div>
      }
    >
      <div className="c-create-alert-page">
        {pageDescription
          ? (
            <div className="description">
              {pageDescription}
            </div>
          )
          : null}
        {alertUpsertError && <div className="error">{alertUpsertError}</div>}
        <div className="inputs">
          <AlertLinkPreview alertForm$={alertForm$} />
          <Input
            label={titleLabel}
            placeholder={titlePlaceholder}
            value$={alertForm$.title}
          />
          <TextArea
            label={descriptionLabel}
            placeholder={descriptionPlaceholder}
            value$={alertForm$.description}
          />
        </div>
      </div>
    </Page>
  );
}

function AlertLinkPreview(
  { alertForm$ }: { alertForm$: Observable<AlertForm> },
) {
  const previewSrc$ = useSignal<string | null>("");

  useObserve(() => {
    const src = getPreviewSrc(alertForm$.link.get());
    previewSrc$.set(src);
  });
  const previewSrc = useSelector(() => previewSrc$.get());

  const onRemove = () => {
    alertForm$.link.set("");
  };

  return previewSrc
    ? (
      <div className="c-alert-link-preview">
        <AlertPreviewIframe previewSrc={previewSrc} />
        <div className="remove" onClick={onRemove}>
          Remove
        </div>
      </div>
    )
    : <Input label="Link" value$={alertForm$.link} />;
}

export function AlertPreviewIframe({ previewSrc }: { previewSrc: string }) {
  return (
    <iframe
      src={previewSrc}
      frameBorder={0}
      allowFullScreen={true}
      title="creator-frame"
      allow="autoplay"
    />
  );
}
