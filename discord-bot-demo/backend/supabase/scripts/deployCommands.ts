// run with --allow-env --allow-net
import { ApplicationCommandOptionType, RESTPutAPIApplicationCommandsJSONBody } from "https://deno.land/x/discord_api_types@0.36.1/v10.ts";

const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN")!;
const DISCORD_APPLICATION_ID = Deno.env.get("DISCORD_APPLICATION_ID")!;

const body: RESTPutAPIApplicationCommandsJSONBody = [{
  name: "user",
  description: "Returns information on a user",
  options: [{
    name: "user",
    description: "The user to get information on",
    required: false,
    type: ApplicationCommandOptionType.User,
  }],
}];

const res = await fetch(
  `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/commands`,
  {
    body: JSON.stringify(body),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${DISCORD_TOKEN}`,
    },
  },
);
const data = await res.json();
console.dir(data);
