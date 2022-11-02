import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
import { fetchChannel } from "./util/channel.ts";
import { fetchKV, upsertKV } from "./util/kv.ts";
import {
  NotificationJobUpsertInput,
  upsertNotificationJob,
} from "./util/notification.ts";

const HAS_SENT_NOTIFICATION_KEY = "hasSentNotificationSinceLive";

function makeResp(statusCode: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

interface CheckIsLiveReqBody {
  notificationJobUpsertInput: NotificationJobUpsertInput | undefined;
}

serve(
  async (req) => {
    const accessToken = req.headers.get("x-access-token");
    const orgId = req.headers.get("x-org-id");
    let reqBody: CheckIsLiveReqBody;

    try {
      reqBody = await req.json();
    } catch {
      return makeResp(400, {
        error: true,
        message: "Please provide a valid JSON body.",
      });
    }

    // return an error if they don't provide an access token
    if (!accessToken) {
      return makeResp(400, {
        error: true,
        message:
          "Please provide a user access token via the 'x-access-token' header.",
      });
    }

    // return an error if they don't provide an access token
    if (!orgId) {
      return makeResp(400, {
        error: true,
        message: "Please provide an org id via the 'x-org-id' header.",
      });
    }

    // grab the notificationJobUpsertInput from the body
    const { notificationJobUpsertInput } = reqBody;
    if (!notificationJobUpsertInput) {
      return makeResp(400, {
        error: true,
        message: "Please provide a notificationJobUpsertInput object.",
      });
    }

    // fetch the associated channel from mycelium
    const channel = await fetchChannel(accessToken, orgId);
    if (!channel) {
      return makeResp(404, {
        error: true,
        message: "The channel requested from the org is undefined.",
      });
    }

    // fetch `hasSentNotificationSinceLive` KV so we know if we need to send a notification
    const hasSentKV = await fetchKV(
      HAS_SENT_NOTIFICATION_KEY,
      accessToken,
      orgId
    );
    const hasSent = hasSentKV?.value === "true";

    // if the channel is live, we want to send a notification
    if (channel.isLive) {
      // don't send out another notification if we've already sent one out
      if (hasSent) {
        return makeResp(200, {
          error: false,
          didSendNotification: false,
          channelId: channel.id,
          message:
            "The channel is live, but a notification has already been sent out.",
        });
      }

      try {
        await upsertNotificationJob(
          notificationJobUpsertInput,
          accessToken,
          orgId
        );
        await upsertKV(HAS_SENT_NOTIFICATION_KEY, "true", accessToken, orgId);
      } catch (errors) {
        return makeResp(500, {
          error: errors,
          message: "Failed to send notification to users.",
        });
      }

      return makeResp(200, {
        error: false,
        didSendNotification: true,
        channelId: channel.id,
        message: "The channel is live! A notification was sent to users.",
      });
    } else {
      // the channel is not live

      // reset `hasSentNotificationSinceLive` if it was set to true
      if (hasSent) {
        await upsertKV(HAS_SENT_NOTIFICATION_KEY, "false", accessToken, orgId);
      }

      // send a response telling them that we didn't send a notification
      return makeResp(200, {
        error: false,
        didSendNotification: false,
        channelId: channel.id,
        message: "The channel is not live. A notification will not be sent.",
      });
    }
  },
  {
    onListen({ port, hostname }) {
      console.log(`Server started at http://${hostname}:${port}`);
    },
  }
);
