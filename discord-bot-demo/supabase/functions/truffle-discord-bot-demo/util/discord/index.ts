import {
  RESTGetAPIGuildMemberResult,
  RouteBases,
  Routes,
} from "https://deno.land/x/discord_api_types@0.36.1/v10.ts";

const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN");

export async function fetchGuildMember(
  guildId: string,
  userId: string,
): Promise<RESTGetAPIGuildMemberResult> {
  const res = await fetch(
    `${RouteBases.api}${Routes.guildMember(guildId, userId)}`,
    {
      headers: {
        "Authorization": `Bot ${DISCORD_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
}
