import {
  APIChatInputApplicationCommandInteraction,
  APIEmbed,
  APIEmbedField,
  Snowflake,
} from "https://deno.land/x/discord_api_types@0.36.1/v10.ts";
import { stripIndents } from "https://deno.land/x/deno_tags@1.8.0/tags/stripIndents.ts";
import {
  getDiscordServerConnection,
  getUserDiscordConnection,
} from "../util/truffle/index.ts";
import { createResponse } from "../util/respond.ts";
import { SOCIAL_MEDIA_EMOJIS, SOCIAL_MEDIA_LINKS } from "../util/constants.ts";

export async function userInfo(
  interaction: APIChatInputApplicationCommandInteraction,
  user?: Snowflake,
) {
  if (!interaction.guild_id || !interaction.member) {
    return createResponse(
      "You must be in a server to use this command",
      true,
    );
  }
  // fetch the configured Discord server connection
  const serverConnection = await getDiscordServerConnection(
    interaction.guild_id!,
  );
  console.dir(serverConnection);
  const { orgId } = serverConnection!;

  // fetch the Discord connection of userId
  const userId = user ?? interaction.member!.user.id;
  console.log({ userId });
  const connection = await getUserDiscordConnection(
    orgId,
    userId,
  );
  console.dir(connection);
  if (!connection) {
    return createResponse(
      `No Truffle account found for <@${userId}>.`,
      true,
    );
  }

  const fields: APIEmbedField[] = [];
  if (Object.values(connection.orgUser.socials).length) {
    fields.push({
      name: "Social Media",
      value: Object.entries(connection.orgUser.socials).map((
        [platform, username],
      ) => {
        const emoji = SOCIAL_MEDIA_EMOJIS[platform];
        const link = platform !== "youtube"
          ? `[@${username}](${SOCIAL_MEDIA_LINKS[platform]}${username}])`
          : username;
        return `${emoji} ${link}`;
      }).join(" • "),
    });
  }

  // finally, display our data!
  const embed: APIEmbed = {
    author: {
      name: connection!.orgUser.user.name,
      icon_url: connection!.orgUser.user.avatar_url,
    },
    description: stripIndents`
      <@${userId}> - ${connection.orgUser.bio ?? "No Bio"}
    `,
    fields,
  };
  console.dir(embed);

  return createResponse("", false, { embeds: [embed] });
}
