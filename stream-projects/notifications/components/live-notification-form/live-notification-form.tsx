import {
  React,
  legend,
  useSignal,
  gql,
  useQuerySignal,
  useObserve,
  useMutation,
  useStyleSheet,
} from "../../deps.ts";
import styleSheet from "./live-notification-form.scss.js";

const NOTIFICATION_CONTENT_QUERY = gql`
  query {
    eventSubscription(
      input: {
        resourcePath: "@truffle/notifications/_EventSubscription/notify-is-live"
      }
    ) {
      actionRel {
        runtimeData
      }
    }
  }
`;

const NOTIFICATION_CONTENT_UPDATE_MUTATION = gql`
  mutation ($input: EventSubscriptionUpsertInput!) {
    eventSubscriptionUpsert(input: $input) {
      eventSubscription {
        id
      }
    }
  }
`;

export default function LiveNotificationForm() {
  useStyleSheet(styleSheet);
  const { eventSubscription: eventSubscription$ } = useQuerySignal(
    NOTIFICATION_CONTENT_QUERY
  );

  const [_, executeContentUpdateMutation] = useMutation(
    NOTIFICATION_CONTENT_UPDATE_MUTATION
  );

  const title$ = useSignal("");
  const body$ = useSignal("");
  const iconUrl$ = useSignal("");
  const action$ = useSignal("");

  useObserve(() => {
    const notificationContent =
      eventSubscription$?.actionRel?.runtimeData?.notificationJobUpsertInput?.content?.get();

    if (notificationContent) {
      title$.set(notificationContent.title);
      body$.set(notificationContent.body);
      iconUrl$.set(notificationContent.icon);
      action$.set(notificationContent.action);
    }
  });

  const handleSubmit = async () => {
    const result = await executeContentUpdateMutation({
      input: {
        resourcePath:
          "@truffle/notifications/_EventSubscription/notify-is-live",
        actionRel: {
          actionPath: "@truffle/notifications/_Action/notify-is-live",
          runtimeData: {
            notificationJobUpsertInput: {
              resourcePath: "@truffle/notifications/_NotificationJob",
              notificationTopicPath:
                "@truffle/notifications/_NotificationTopic/notify-is-live",
              content: {
                title: title$.get(),
                body: body$.get(),
                // `|| null` prevents us from saving these as empty strings
                icon: iconUrl$.get() || null,
                action: action$.get() || null,
              },
            },
          },
        },
      },
    });

    if (result?.error) {
      console.error(
        "Error ocurred while updating notification content",
        result?.error
      );
      alert("OOPS! It looks like an error occurred");
    } else {
      alert("Notification content saved successfully");
    }
  };

  return (
    <div className="c-live-notification-form">
      <h1>Going live notification</h1>
      <div className="form">
        <div>
          <h4>Title</h4>
          <legend.input value$={title$} placeholder="Notification title" />
        </div>
        <div>
          <h4>Body</h4>
          <legend.textarea value$={body$} placeholder="Notification body" />
        </div>
        <div>
          <h4>Icon URL</h4>
          <legend.input value$={iconUrl$} placeholder="Icon URL" />
        </div>
        <div>
          <h4>Action URL</h4>
          <legend.input value$={action$} placeholder="Action URL" />
        </div>
        <div className="button-container">
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}
