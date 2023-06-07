import { jumper, useEffect, useState } from "../../../deps.ts";

interface UseFcmTokenResult {
  fcmToken: string | undefined;
}

export function useFcmTokenManager(): UseFcmTokenResult {
  const [fcmToken, setFcmToken] = useState();

  // listen to the notification permission state and get an
  // fcm token if the user granted notification permissions
  useEffect(() => {
    jumper.call("extension.getFCMToken").then((token: string | undefined) => {
      if (token) {
        setFcmToken(token);
      }
    });
  }, []);

  return { fcmToken };
}
