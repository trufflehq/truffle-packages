import {
  APIChatInputApplicationCommandInteraction,
  APIEmbed,
  APIEmbedField,
  CDNRoutes,
  ImageFormat,
  RouteBases,
  Snowflake,
} from "https://deno.land/x/discord_api_types@0.36.1/v10.ts";
import { stripIndents } from "https://deno.land/x/deno_tags@1.8.0/tags/stripIndents.ts";
import { getDiscordServerConnection, getOrg, getUserDiscordConnection } from "../util/truffle/index.ts";
import { createResponse } from "../util/respond.ts";
import { fetchGuildMember } from "../util/discord/index.ts";
import { SOCIAL_MEDIA_EMOJIS, SOCIAL_MEDIA_LINKS } from "../util/constants.ts";

function createGuildMemberAvatar(
  userId: string,
  discriminator: string,
  avatarHash?: string | null,
): string {
  if (!avatarHash) {
    return `${RouteBases.cdn}/embed/avatars/${discriminator}.png`;
  }

  const ext = avatarHash.startsWith("a_") ? ImageFormat.GIF : ImageFormat.PNG;
  return `${RouteBases.cdn}${CDNRoutes.userAvatar(userId, avatarHash, ext)}?size=512`;
}

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
  const { orgId } = serverConnection!;

  // fetch the Discord connection of userId-
  const userId = user ?? interaction.member!.user.id;
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

  const member = await fetchGuildMember(interaction.guild_id!, userId);
  const org = await getOrg(orgId);
  const avatar = createGuildMemberAvatar(
    userId,
    member.user!.discriminator,
    member.avatar ?? member.user!.avatar,
  );

  const fields: APIEmbedField[] = [];
  if (Object.values(connection.orgUser.socials).length) {
    fields.push({
      name: "Social Media",
      value: Object.entries(connection.orgUser.socials).map((
        [platform, username],
      ) => {
        const emoji = SOCIAL_MEDIA_EMOJIS[platform];
        const link = platform !== "youtube" ? `[@${username}](${SOCIAL_MEDIA_LINKS[platform]}${username})` : `[Link](${username})`;
        return `${emoji} ${link}`;
      }).join(" • "),
    });
  }

  // finally, display our data!
  const embed: APIEmbed = {
    color: parseInt(
      org?.orgConfig.colors.primaryBase?.replace("#", "") ?? "FFFFFF",
      16,
    ),
    author: {
      name: `${interaction.member?.user.username}#${interaction.member?.user.discriminator}'s ${org?.name} Profile`,
      icon_url: avatar,
    },
    description: stripIndents`
      <@${userId}> - ${connection.orgUser.bio ?? "No Bio"}
      Level \`${connection.orgUser.seasonPass.orgUserStats.levelNum}\` (\`${
      connection.orgUser.seasonPass.orgUserStats.xp.toLocaleString("en-US")
    }\` XP)
    `,
    fields,
  };
  console.dir(embed);

  return createResponse("", false, { embeds: [embed] });
}
