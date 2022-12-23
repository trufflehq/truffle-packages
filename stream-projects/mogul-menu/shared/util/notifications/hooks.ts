import { useActionBanner } from "../../../components/action-banner/hooks.ts";
import SetupNotificationsBanner from "../../../components/notifications/setup-notifications-banner.tsx";
import {
  jumper,
  React,
  useComputed,
  useEffect,
  useMemo,
  useMutation,
  useObserve,
  useQuery,
  useRef,
} from "../../../deps.ts";
import { NotificationTopic } from "../../../types/notification.types.ts";
import {
  DELETE_FCM_TOKEN_MUTATION,
  FCM_TOKEN_QUERY,
  UPSERT_FCM_TOKEN_MUTATION,
} from "../../gql/fcm-token.ts";
import {
  NOTIFICATION_TOPIC_QUERY,
  UPSERT_NOTIFICATION_SUBSCRIPTION_MUTATION,
} from "../../gql/notifications.gql.ts";
import { useFcmTokenManager, useIsNative } from "../../mod.ts";
import { isGoogleChrome } from "../general.ts";
import { useUserKV } from "../kv/hooks.ts";
import { HAS_SEEN_NOTIFICATION_SETUP_BANNER } from "./constants.ts";

export function useNotificationTopics() {
  const [{ data: notificationTopicData, fetching }] = useQuery({
    query: NOTIFICATION_TOPIC_QUERY,
  });
  const notificationTopics: NotificationTopic[] = useMemo(
    () => notificationTopicData?.notificationTopicConnection?.nodes,
    [notificationTopicData],
  );

  const [_upsertResults, upsertNotificationSubscription] = useMutation(
    UPSERT_NOTIFICATION_SUBSCRIPTION_MUTATION,
  );
  const subscribeToNotificationTopic = async (topic: NotificationTopic) => {
    await upsertNotificationSubscription({
      subscriptions: [{
        notificationTopicId: topic.id,
        isSubscribed: true,
      }],
    }, { additionalTypenames: ["NotificationTopicConnection"] });
  };
  const unSubscribeFromNotificationTopic = async (topic: NotificationTopic) => {
    await upsertNotificationSubscription({
      subscriptions: [{
        notificationTopicId: topic.id,
        isSubscribed: false,
      }],
    }, { additionalTypenames: ["NotificationTopicConnection"] });
  };

  return {
    notificationTopics,
    fetching,
    subscribeToNotificationTopic,
    unSubscribeFromNotificationTopic,
  };
}

export function useFcmNotificationMediumConfig(token: string | undefined) {
  const [{ data: fcmTokenData, fetching }] = useQuery({
    query: FCM_TOKEN_QUERY,
    variables: { token },
    context: useMemo(() => ({
      additionalTypenames: ["NotificationMediumUserConfig"],
    }), []),
  });

  const isTokenRegistered = useMemo(
    () => Boolean(fcmTokenData?.notificationMediumUserConfig),
    [
      fcmTokenData,
    ],
  );

  const [_upsertResult, upsertFcmToken] = useMutation(
    UPSERT_FCM_TOKEN_MUTATION,
  );
  const [_deleteResult, deleteFcmToken] = useMutation(
    DELETE_FCM_TOKEN_MUTATION,
  );

  const registerToken = async () => {
    if (token) {
      const context = await jumper.call("context.getInfo");
      console.log("registering fcmToken with mycelium");
      await upsertFcmToken({
        token,
        platform: context?.platform ?? "extension-chrome",
      });
    }
  };

  const unregisterToken = async () => {
    if (token) {
      console.log("unregistering fcmToken with mycelium");
      await deleteFcmToken({ token });
    }
  };

  return { isTokenRegistered, registerToken, unregisterToken, fetching };
}

export function useDesktopNotificationSetting() {
  const { fcmToken } = useFcmTokenManager();
  const { isTokenRegistered, registerToken, unregisterToken } =
    useFcmNotificationMediumConfig(
      fcmToken,
    );

  useEffect(() => {
    console.log("fcm token", fcmToken);
  }, [fcmToken]);

  const isDesktopNotificationsEnabled = isTokenRegistered;
  const setDesktopNotificationPref = async (enable: boolean) => {
    // don't try to register an undefined token
    if (!fcmToken) return;

    // enable desktop notifications
    if (enable) {
      await registerToken();

      // disable desktop notifications
    } else {
      await unregisterToken();
    }
  };

  return { isDesktopNotificationsEnabled, setDesktopNotificationPref };
}

export function useFirstTimeNotificationBanner() {
  const actionBannerIdRef = useRef("");
  const { isNotificationBannerVisible$ } = useIsNotificationBannerVisible();

  const { displayActionBanner, removeActionBanner } = useActionBanner();
  const isNative = useIsNative();

  useObserve(() => {
    if (!isNotificationBannerVisible$.get()) {
      removeActionBanner(actionBannerIdRef.current);

      // notifications only supported on Google Chrome & native atm
    } else if (isGoogleChrome || isNative) {
      actionBannerIdRef.current = displayActionBanner(
        // we're using `React.createElement` here because this code is not in a tsx file
        React.createElement(SetupNotificationsBanner, { actionBannerIdRef }),
      ) ?? "";
    }
  });
}

export function useIsNotificationBannerVisible() {
  // if you want to force this banner to show up again for users, change this "truthyValue"
  const truthyValue = "1";

  const { value$, fetching$, setUserKV } = useUserKV(
    HAS_SEEN_NOTIFICATION_SETUP_BANNER,
    true,
  );
  const isNotificationBannerVisible$ = useComputed(() =>
    !fetching$.get() && value$.get() !== truthyValue
  );

  const setHasSeen = (hasSeen: boolean) =>
    setUserKV(hasSeen ? truthyValue : "");

  return { isNotificationBannerVisible$, setHasSeen };
}
