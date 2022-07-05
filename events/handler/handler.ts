export const TRUFFLE_WEBHOOK_VERIFICATION_CHALLENGE = "webhook/verification";
export type TruffleWebhookVerificationChallenge =
  typeof TRUFFLE_WEBHOOK_VERIFICATION_CHALLENGE;

export type EventTopicPath =
  | string
  | TruffleWebhookVerificationChallenge
  | undefined;

export interface TruffleEventPayload<K> {
  eventTopicPath: EventTopicPath;
  data: K;
}

export interface TruffleDefaultEventData {
  userId?: string;
  orgId?: string;
}

export interface TruffleCollectibleRedeemEventData<U>
  extends TruffleDefaultEventData {
  collectibleData: {
    eventTopicId: string;
  };
  additionalData: U;
}

export interface TruffleWebhookVerificationPayload<K>
  extends TruffleEventPayload<K> {
  eventTopicPath: TruffleWebhookVerificationChallenge;
  challenge: string;
}

export function isWebhookVerificationPayload<K>(
  eventData: TruffleEventPayload<K>,
): eventData is TruffleWebhookVerificationPayload<K> {
  return (eventData as TruffleWebhookVerificationPayload<K>)?.eventTopicPath ===
      TRUFFLE_WEBHOOK_VERIFICATION_CHALLENGE &&
    Boolean((eventData as TruffleWebhookVerificationPayload<K>)?.challenge);
}

export function isTruffleEventPayload<K>(
  eventData: TruffleEventPayload<K>,
): eventData is TruffleEventPayload<K> {
  return Boolean((eventData as TruffleEventPayload<K>)?.eventTopicPath);
}

export function respondWithChallenge<K>(
  eventData: TruffleWebhookVerificationPayload<K>,
) {
  return new Response(eventData.challenge, { status: 200 });
}
