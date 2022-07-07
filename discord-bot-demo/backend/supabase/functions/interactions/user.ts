import {
  APIChatInputApplicationCommandInteraction,
  APIEmbed,
  Snowflake,
} from "https://deno.land/x/discord_api_types@0.36.1/v10.ts";
import { stripIndents } from "https://deno.land/x/deno_tags@1.8.0/tags/stripIndents.ts";
import {
  getDiscordServerConnection,
  getUserDiscordConnection,
} from "../util/truffle/index.ts";
import { createResponse } from "../util/respond.ts";

export async function userInfo(
  interaction: APIChatInputApplicationCommandInteraction,
  user?: Snowflake,
) {
  // fetch the configured Discord server connection
  const serverConnection = await getDiscordServerConnection(
    interaction.guild_id!,
  );
  const { orgId } = serverConnection!;

  // fetch the Discord connection of userId
  const userId = user || interaction.user!.id;
  const connection = await getUserDiscordConnection(
    orgId,
    userId,
  );
  if (!connection) {
    return createResponse(
      `No Truffle account found for <@${userId}>.`,
      true,
    );
  }

  // finally, display our data!
  const embed: APIEmbed = {
    title: `${connection!.orgUser.user.name}'s Discord Connection`,
    description: stripIndents`
		${connection.orgUser.bio ?? "No Bio"}
		${
      Object.entries(connection.orgUser.socials).map((s) => `${s[0]}: ${s[1]}`)
        .join("\n")
    }
	`,
  };

  return createResponse("", false, { embeds: [embed] });
}
