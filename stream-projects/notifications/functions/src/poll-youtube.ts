import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
import { fetchChannel } from "./util/channel.ts";
import { upsertNotificationJob } from "./util/notification.ts";

function makeResp(statusCode: number, body: object) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

serve(
  async (req) => {
    const apiKey = req.headers.get("x-org-key");
    let reqBody;

    try {
      reqBody = await req.json();
    } catch {
      return makeResp(400, {
        error: true,
        message: "Please provide a valid JSON body.",
      });
    }

    // return an error if they don't provide an api key
    if (!apiKey) {
      return makeResp(400, {
        error: true,
        message: "Please provide an org api key via the 'x-org-key' header.",
      });
    }

    // grab the notificationJobUpsertInput from the body
    const { notificationJobUpsertInput } = reqBody ?? {};
    if (!notificationJobUpsertInput)
      return makeResp(400, {
        error: true,
        message: "Please provide a notificationJobUpsertInput object.",
      });

    // fetch the associated channel from mycelium
    const channel = await fetchChannel(apiKey);
    if (!channel)
      return makeResp(404, {
        error: true,
        message: "The channel requested from the org is undefined.",
      });

    // if the channel is live, we want to send a notification
    if (channel.isLive) {
      try {
        await upsertNotificationJob(notificationJobUpsertInput, apiKey);
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
      // if not, simply send a response telling them that we didn't send a notification
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
