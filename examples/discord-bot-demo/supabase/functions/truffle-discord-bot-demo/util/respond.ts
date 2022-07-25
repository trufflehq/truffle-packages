import {
  AllowedMentionsTypes,
  APIEmbed,
  InteractionResponseType,
  RESTPatchAPIWebhookWithTokenMessageResult,
  Routes,
} from "https://deno.land/x/discord_api_types@0.36.1/v10.ts";

export function createResponse(
  content: string,
  ephemeral = false,
  {
    embeds,
    users,
    parse,
  }: {
    embeds?: APIEmbed[];
    users?: string[];
    parse?: AllowedMentionsTypes[];
  } = {},
): Response {
  return new Response(
    JSON.stringify({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content,
        embeds,
        flags: ephemeral ? 64 : 0,
        allowed_mentions: { parse, users },
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

export async function sendFollowup(
  applicationId: string,
  interactionToken: string,
  content: string,
  ephemeral = false,
  {
    embeds,
    users,
    parse,
  }: {
    embeds?: APIEmbed[];
    users?: string[];
    parse?: AllowedMentionsTypes[];
  } = {},
): Promise<RESTPatchAPIWebhookWithTokenMessageResult> {
  const response = await fetch(
    Routes.webhookMessage(applicationId, interactionToken, "@original"),
    {
      method: "PATCH",
      body: JSON.stringify({
        content,
        embeds,
        flags: ephemeral ? 64 : 0,
        allowed_mentions: { parse, users },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.json();
}

export function defer(ephemeral = false) {
  return new Response(
    JSON.stringify({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: { flags: ephemeral ? 64 : 0 },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

export function ack() {
  return new Response(
    JSON.stringify({
      type: 1,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
