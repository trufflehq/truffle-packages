import { truffleFetch } from "./fetch.ts";

export type GetOrgResult = {
  data: {
    org: {
      id: string;
      name: string;
      slug: string;
      orgConfig: {
        colors: {
          primaryBase: string;
          secondaryBase: string;
          bgBase: string;
          tertiaryBase: string;
        };
        data: Record<string, string>;
      };
    };
  };
};

export async function getOrg(
  id: string,
) {
  const query = `query GetOrg(
		$id: ID
	) {
		org(input: { id: $id }) {
			id
			name
			slug
			orgConfig {
				colors
				data
			}
		}
	}
  `;

  const variables = {
    id,
  };

  try {
    const response = await truffleFetch(query, variables);
    const data: GetOrgResult = await response.json();

    return data.data.org;
  } catch (err) {
    console.error("error during truffle fetch", err.message);
  }
}
