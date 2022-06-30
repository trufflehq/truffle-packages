import {
  getPathParts,
  PathParts,
} from "https://tfl.dev/@truffle/utils@0.0.1/packages/path-parts.ts";
import {
  isTruffleEventPayload,
  isWebhookVerificationPayload,
  respondWithChallenge,
  TruffleEventPayload,
} from "../handler.ts";

export type SupabaseCallbackHandler<T> = (
  eventData: T | null,
  eventTopicParts?: PathParts | null,
) => Response | Promise<Response>;

export async function handleTruffleWebhookEventSupabase<
  E,
>(
  req: Request,
  callback: SupabaseCallbackHandler<TruffleEventPayload<E>>,
) {
  try {
    const clonedRequest: Request = req.clone();
    const eventResult = await clonedRequest.json();
    const eventData = eventResult.data;

    if (!isTruffleEventPayload<E>(eventData)) {
      return callback(null);
    }

    if (isWebhookVerificationPayload(eventData)) {
      try {
        return respondWithChallenge(eventData);
      } catch (err) {
        console.error("Error verifying webhook", err);
      }
    }

    const eventTopicPath = eventData.eventTopicPath;

    // parse the event topic path
    if (eventTopicPath) {
      const eventTopicParts = getPathParts(eventTopicPath);

      return callback(eventData, eventTopicParts);
    }

    return callback(null);
  } catch (err) {
    console.error(`Error processing webhook`, err?.message);

    return callback(err);
  }
}
