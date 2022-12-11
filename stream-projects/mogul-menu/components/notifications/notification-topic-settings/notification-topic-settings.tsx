import { React, useStyleSheet } from "../../../deps.ts";
import { useNotificationTopics } from "../../../shared/mod.ts";
import { NotificationTopic } from "../../../types/notification.types.ts";
import Switch from "../../base/switch/switch.tsx";

import styleSheet from "./notification-topic-settings.scss.js";

export default function NotificationTopicSettings() {
  useStyleSheet(styleSheet);
  const {
    notificationTopics,
    subscribeToNotificationTopic,
    unSubscribeFromNotificationTopic,
  } = useNotificationTopics();

  const subscriptionSwitchToggleHandler = async (
    topic: NotificationTopic,
    subscribe: boolean,
  ) => {
    if (subscribe) {
      await subscribeToNotificationTopic(topic);
    } else {
      await unSubscribeFromNotificationTopic(topic);
    }
  };

  return (
    <div className="c-notification-topic-settings">
      {notificationTopics?.map((topic) => (
        <div className="row">
          <div className="name">{topic.name}</div>
          <div className="input">
            <Switch
              showIsLoading
              value={topic.isSubscribed}
              onChange={(enabled: boolean) => subscriptionSwitchToggleHandler(topic, enabled)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
