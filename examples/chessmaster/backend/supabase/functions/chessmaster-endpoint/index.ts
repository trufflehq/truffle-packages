import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import {
  handleTruffleWebhookEventSupabase,
  TruffleCollectibleRedeemEventData,
} from "https://tfl.dev/@truffle/events@0.0.1/index.ts";
import { ChessGameManager, moveExecutor } from "./utils/chess.ts";
import { getCurrentPoll, updatePoll } from "./utils/polls.ts";
import { ChessMoveAdditionalData } from "./utils/types.ts";

const CHESS_MOVE_REDEEM_TOPIC_SLUG = Deno.env.get(
  "CHESS_MOVE_REDEEM_TOPIC_SLUG"
);

const PORT = parseInt(Deno.env.get("PORT") ?? "8000");

const LICHESS_API_TOKEN = Deno.env.get("LICHESS_API_TOKEN") ?? '';

// You can define types for the custom payload of your event
// that you can use to add type safety for your event inside of `handleTruffleWebhookEventSupabase`
type ViewCollectibleEventData =
  TruffleCollectibleRedeemEventData<ChessMoveAdditionalData>;

console.log('Initializing chessGameManager...')
const chessGameManager = new ChessGameManager(LICHESS_API_TOKEN);

const handler = (request: Request) =>
  handleTruffleWebhookEventSupabase<ViewCollectibleEventData>(
    request,
    async (eventData, eventTopicParts) => {
      // persists the raw result if you need something from the request
      // outside of the eventData
      const rawResult = await request.json();

      console.log("eventData", eventData);
      console.log("rawResult", rawResult);
      console.log("eventTopicParts", eventTopicParts);

      if (!eventData) {
        return new Response(
          JSON.stringify(`Pong! ${JSON.stringify(rawResult)}`),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      if (eventTopicParts) {
        switch (eventTopicParts.slug) {
          case CHESS_MOVE_REDEEM_TOPIC_SLUG: {
            const userId = eventData.data.userId;
            const orgId = eventData.data.orgId;
            const move = eventData.data.additionalData.move;
            const gameId = eventData.data.additionalData.gameId;
            console.log(
              `${userId} just redeemed the 'Chess move' collectible. Adding a poll option for ${move}`
            );

            const currentPoll = await getCurrentPoll(orgId);

            const matchBot = chessGameManager.getMatchBotById(gameId)
            if (!matchBot) {
              console.error('No match bot associated with game', gameId)
              break;
            }

            // queue up the move
            moveExecutor.queueMove(currentPoll, matchBot);

            // prevent from getting duplicate poll options
            if (currentPoll.options.find((option) => option.text === move)) {
              console.log(
                "someone has already created a poll option for this move; skipping..."
              );
            }

            const newOptions = [...currentPoll.options, { text: move }];
            await updatePoll(currentPoll.id, newOptions, orgId);
            console.log(
              "successfully added poll option to poll",
              currentPoll.id
            );
            break;
          }
        }
      }

      return new Response(JSON.stringify("OK"), {
        headers: { "Content-Type": "application/json" },
      });
    }
  );

serve(handler, { port: PORT });

// To invoke:
// curl -L -X POST '<supabase function url>' --data '{"name":"Functions"}'
