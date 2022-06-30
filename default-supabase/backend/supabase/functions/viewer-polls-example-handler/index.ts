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

const VIEWER_CREATED_POLL_EVENT_SLUG = "viewer-create-poll";

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
        return new Response(
          JSON.stringify(`Pong! ${JSON.stringify(rawResult)}`),
          { headers: { "Content-Type": "application/json" } },
        );
      }

      if (eventTopicParts) {
        const isViewerCreatedPollEvent = isTargetEventTopicByParts(
          eventTopicParts,
          VIEWER_CREATED_POLL_EVENT_SLUG,
        );

        if (isViewerCreatedPollEvent) {
          const question = eventData.data.additionalData.question;
          const pollOptions = eventData.data.additionalData.options;
          const userId = eventData.data.userId;

          if (userId) {
            const truffleUser = await getUserById(userId);
            const authoredQuestion = getPollQuestionWithAuthorName(
              question,
              truffleUser?.name,
            );

            const poll = await createPoll(authoredQuestion, pollOptions);

            console.log("poll created", JSON.stringify(poll));
          }
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
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
