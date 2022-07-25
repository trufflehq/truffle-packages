import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import {
  handleTruffleWebhookEventSupabase,
  isTargetEventTopicByParts,
  TruffleCollectibleRedeemEventData,
} from "https://tfl.dev/@truffle/events@0.0.1/index.ts";
import {
  createPoll,
  getUserById,
  ViewerCreatePollUserInput,
} from "./api/truffle/index.ts";
import { getPollQuestionWithAuthorName } from "./utils/polls.ts";

const VIEWER_CREATED_POLL_EVENT_TOPIC_SLUG = Deno.env.get(
  "VIEWER_CREATED_POLL_EVENT_TOPIC_SLUG",
);

// You can define types for the custom payload of your event
// that you can use to add type safety for your event inside of `handleTruffleWebhookEventSupabase`
type ViewCollectibleEventData = TruffleCollectibleRedeemEventData<
  ViewerCreatePollUserInput
>;

const handler = (request: Request) =>
  handleTruffleWebhookEventSupabase<ViewCollectibleEventData>(
    request,
    async (eventData, eventTopicParts) => {
      // persists the raw result if you need something from the request
      // outside of the eventData
      const rawResult = await request.json();

      if (!eventData) {
        console.log("Missing eventData");

        return new Response(
          JSON.stringify(`Pong! ${JSON.stringify(rawResult)}`),
          { headers: { "Content-Type": "application/json" } },
        );
      }

      if (eventTopicParts && VIEWER_CREATED_POLL_EVENT_TOPIC_SLUG) {
        const isViewerCreatedPollEvent = isTargetEventTopicByParts(
          eventTopicParts,
          VIEWER_CREATED_POLL_EVENT_TOPIC_SLUG,
        );

        if (isViewerCreatedPollEvent) {
          const question = eventData.data.additionalData.question;
          const pollOptions = eventData.data.additionalData.options;
          const userId = eventData.data?.userId;
          const orgId = eventData.data?.orgId;

          console.log("event metadata", { userId, orgId });

          if (userId) {
            const truffleUser = await getUserById(userId);

            console.log("truffleUser", truffleUser);

            const authoredQuestion = getPollQuestionWithAuthorName(
              question,
              truffleUser?.name,
            );

            const poll = await createPoll(authoredQuestion, pollOptions, orgId);

            console.log("poll created", JSON.stringify(poll));
          }
        } else {
          console.log("Not a viewer created poll event");
        }
      }

      return new Response(
        JSON.stringify("OK"),
        { headers: { "Content-Type": "application/json" } },
      );
    },
  );

serve(handler);

// To invoke:
// curl -L -X POST '<supabase function url>' --data '{"name":"Functions"}'
