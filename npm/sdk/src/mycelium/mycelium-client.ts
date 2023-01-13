import { Client, ClientOptions } from "@urql/core";
import { DEFAULT_MYCELIUM_API_URL } from "../constants";
import { getAccessToken } from "../user/access-token";

export interface MyceliumClientOptions {
  url: string;
  userAccessToken?: string;
  urqlOptions?: ClientOptions
}

export async function createMyceliumClient(options: MyceliumClientOptions = {
  url: DEFAULT_MYCELIUM_API_URL
}) {

  const userAccessToken = options.userAccessToken || await getAccessToken();
  if (!userAccessToken) {
    return null;
  }

  // TODO: change this to use authExchange instead
  return new Client({
    url: options.url,
    fetchOptions: {
      headers: {
        'x-access-token': userAccessToken
      }
    },
    ...options.urqlOptions
  })
}