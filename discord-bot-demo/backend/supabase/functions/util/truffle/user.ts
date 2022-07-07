import { truffleFetch } from "./fetch.ts";

export type GetDiscordConnectionJSONResponse = {
  data: {
    connection: {
      id: string;
      orgId: string;
      userId: string;
      sourceType: string;
      sourceId: string;
      secondarySourceId: string | "none";
      orgUser: {
        bio: string;
        socials: Record<string, string>;
        user: Record<string, string>;
      };
    };
  };
};

export async function getDiscordConnection(
  orgId: string,
  sourceId: string,
  sourceType = "discord",
) {
  const query = `query GetDiscordConnection(
    $sourceType: String
    $sourceId: String
    $orgId: ID
  ) {
    connection(input: { sourceType: $sourceType, sourceId: $sourceId, orgId: $orgId }) {
      id
      orgId
      userId
      sourceType
      sourceId
      secondarySourceId
      orgUser {
        socials
        user {
          name
        }
      }
    }
  }
  `;

  const variables = {
    sourceType,
    sourceId,
    orgId,
  };

  try {
    const response = await truffleFetch(query, variables);
    const data: GetDiscordConnectionJSONResponse = await response.json();

    return data.data.connection;
  } catch (err) {
    console.error("error during truffle fetch", err.message);
  }
}
