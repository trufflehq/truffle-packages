const MYCELIUM_API_URL = "https://mycelium.truffle.vip/graphql";

interface MyceliumOptions {
  accessToken: string;
  orgId: string;
}

export interface GQLResponse<T = unknown> {
  data: T;
  errors: unknown[];
}

export function graphqlReq(
  query: string,
  variables: Record<string, unknown>,
  options: MyceliumOptions,
) {
  return fetch(MYCELIUM_API_URL, {
    method: "POST",
    body: JSON.stringify({ query, variables }),
    headers: {
      "Content-Type": "application/json",
      "x-org-id": options.orgId,
      "x-access-token": options.accessToken,
    },
  });
}

export function gql(strings: TemplateStringsArray, ..._values: string[]) {
  return strings.join();
}
