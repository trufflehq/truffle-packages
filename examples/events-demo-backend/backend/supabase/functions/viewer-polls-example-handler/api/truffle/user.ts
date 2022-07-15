import { truffleFetch } from "./fetch.ts";

export type UserPayload = {
  data: {
    user: {
      id: string;
      name: string;
      time: Date;
      avatarImage: {
        cdn: string;
        prefix: string;
        ext: string;
        data: unknown;
        aspectRatio: number;
      };
    };
  };
};

export async function getUserById(id: string) {
  const query = `query UserById ($input: UserInput) {
    user(input: $input) {
      id
      name
      time
    }
  }`;

  const variables = {
    input: {
      id,
    },
  };

  try {
    const response = await truffleFetch(query, variables);
    const data: UserPayload = await response.json();

    return data.data.user;
  } catch (err) {
    console.error("error during truffle fetch", err.message);
  }
}
