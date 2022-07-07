import {
  ApplicationCommandOptionType,
  RESTPutAPIApplicationCommandsJSONBody,
  Routes,
} from "https://deno.land/x/discord_api_types@0.36.1/v10.ts";
import { encode } from "https://deno.land/std/encoding/base64.ts";

const DISCORD_APPLICATION_ID = Deno.env.get("DISCORD_APPLICATION_ID")!;
const DISCORD_APPLICATION_SECRET = Deno.env.get("DISCORD_APPLICATION_SECRET")!;

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

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

async function createDiscordAccessToken(): Promise<AccessTokenResponse> {
  const body = new URLSearchParams();
  body.append("grant_type", "client_credentials");
  body.append("scope", "applications.commands.update");

  const res = await fetch(
    `https://discord.com/api/v10${Routes.oauth2TokenExchange()}`,
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Basic ${
          encode(`${DISCORD_APPLICATION_ID}:${DISCORD_APPLICATION_SECRET}`)
        }`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return res.json();
}

const token = await createDiscordAccessToken();
console.dir(token);

const res = await fetch(
  `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/commands`,
  {
    body: JSON.stringify(body),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token.token_type} ${token.access_token}`,
    },
  },
);
const data = await res.json();
console.dir(data);
